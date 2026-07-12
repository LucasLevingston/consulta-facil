import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
	default: ({
		href,
		children,
	}: {
		href: string;
		children: React.ReactNode;
	}) => <a href={href}>{children}</a>,
}));
vi.mock("@/components/appointments/detail/use-create-payment", () => ({
	useCreatePayment: vi.fn(),
}));
vi.mock("@/components/appointments/hooks", () => ({
	useCheckInToken: vi.fn(),
}));
vi.mock("@/components/forms/Appointments/RateAppointmentForm", () => ({
	RateAppointmentForm: () => <div>mock-rate-appointment-form</div>,
}));
vi.mock("@/components/ui/dialog", () => ({
	Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
		open ? <div>{children}</div> : null,
	DialogContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogTitle: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogDescription: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

import { AppointmentHeader } from "@/components/appointments/detail/AppointmentHeader";
import { AppointmentPaymentSection } from "@/components/appointments/detail/AppointmentPaymentSection";
import { AppointmentProfessionalCard } from "@/components/appointments/detail/AppointmentProfessionalCard";
import { AppointmentRatingSection } from "@/components/appointments/detail/AppointmentRatingSection";
import { QrCodeDialog } from "@/components/appointments/detail/QrCodeDialog";
import { StarDisplay } from "@/components/appointments/detail/StarDisplay";
import { useCreatePayment } from "@/components/appointments/detail/use-create-payment";
import { useCheckInToken } from "@/components/appointments/hooks";

const baseAppointment = {
	id: "a-1",
	status: "CONFIRMED",
	scheduledAt: "2026-07-10T14:00:00Z",
	patientId: "p-1",
	professionalId: "prof-1",
	professionalName: "Dra. Ana Costa",
	specialty: "CARDIOLOGIA",
	modality: "IN_PERSON",
} as never;

describe("AppointmentHeader", () => {
	it("renderiza o título da página", () => {
		render(<AppointmentHeader appointment={baseAppointment} />);
		expect(screen.getByText("Detalhes da consulta")).toBeInTheDocument();
	});

	it("renderiza o badge de status Confirmada", () => {
		render(<AppointmentHeader appointment={baseAppointment} />);
		expect(screen.getByText("Confirmada")).toBeInTheDocument();
	});

	it("renderiza o badge de status Pendente", () => {
		render(
			<AppointmentHeader
				appointment={{ ...baseAppointment, status: "PENDING" } as never}
			/>,
		);
		expect(screen.getByText("Pendente")).toBeInTheDocument();
	});

	it("renderiza o link de voltar", () => {
		render(<AppointmentHeader appointment={baseAppointment} />);
		expect(screen.getByText("Voltar")).toBeInTheDocument();
	});
});

describe("AppointmentProfessionalCard", () => {
	it("renderiza o nome do profissional", () => {
		render(<AppointmentProfessionalCard appointment={baseAppointment} />);
		expect(screen.getByText("Dra. Ana Costa")).toBeInTheDocument();
	});

	it("renderiza a especialidade traduzida", () => {
		render(<AppointmentProfessionalCard appointment={baseAppointment} />);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("não renderiza especialidade quando ausente", () => {
		render(
			<AppointmentProfessionalCard
				appointment={{ ...baseAppointment, specialty: null } as never}
			/>,
		);
		expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
	});
});

describe("AppointmentPaymentSection", () => {
	function setup(createPayment = vi.fn()) {
		vi.mocked(useCreatePayment).mockReturnValue({
			mutateAsync: createPayment,
			isPending: false,
		} as never);
		return { createPayment };
	}

	it("mostra pagamento confirmado quando paymentStatus=PAID", () => {
		setup();
		render(
			<AppointmentPaymentSection
				appointment={
					{
						...baseAppointment,
						paymentStatus: "PAID",
						paymentAmount: 150,
					} as never
				}
			/>,
		);
		expect(screen.getByText("Pagamento confirmado")).toBeInTheDocument();
		expect(screen.getByText("R$ 150.00")).toBeInTheDocument();
	});

	it("não renderiza nada quando status=CANCELED e não pago", () => {
		setup();
		const { container } = render(
			<AppointmentPaymentSection
				appointment={{ ...baseAppointment, status: "CANCELED" } as never}
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	it("mostra mensagem de pagamento pendente quando paymentStatus=PENDING_PAYMENT", () => {
		setup();
		render(
			<AppointmentPaymentSection
				appointment={
					{ ...baseAppointment, paymentStatus: "PENDING_PAYMENT" } as never
				}
			/>,
		);
		expect(
			screen.getByText("Pagamento pendente. Conclua no link abaixo."),
		).toBeInTheDocument();
	});

	it("mostra botão de pagar consulta quando não há pagamento", () => {
		setup();
		render(
			<AppointmentPaymentSection
				appointment={{ ...baseAppointment, paymentStatus: null } as never}
			/>,
		);
		expect(screen.getByText("Pagar consulta")).toBeInTheDocument();
	});

	it("chama createPayment ao clicar em Pagar consulta", async () => {
		const createPayment = vi
			.fn()
			.mockResolvedValue({ checkoutUrl: "https://checkout.example" });
		setup(createPayment);
		vi.stubGlobal("open", vi.fn());
		render(
			<AppointmentPaymentSection
				appointment={{ ...baseAppointment, paymentStatus: null } as never}
			/>,
		);
		await userEvent.click(screen.getByText("Pagar consulta"));
		expect(createPayment).toHaveBeenCalledWith({ appointmentId: "a-1" });
		vi.unstubAllGlobals();
	});
});

describe("AppointmentRatingSection", () => {
	it("não renderiza nada quando status diferente de COMPLETED", () => {
		const { container } = render(
			<AppointmentRatingSection
				appointment={baseAppointment}
				canRate={false}
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	it("mostra as estrelas quando já existe avaliação", () => {
		render(
			<AppointmentRatingSection
				appointment={
					{ ...baseAppointment, status: "COMPLETED", rating: 4 } as never
				}
				canRate={false}
			/>,
		);
		expect(screen.getByText("Avaliação")).toBeInTheDocument();
	});

	it("mostra o comentário da avaliação quando presente", () => {
		render(
			<AppointmentRatingSection
				appointment={
					{
						...baseAppointment,
						status: "COMPLETED",
						rating: 5,
						ratingComment: "Excelente atendimento",
					} as never
				}
				canRate={false}
			/>,
		);
		expect(screen.getByText(/Excelente atendimento/)).toBeInTheDocument();
	});

	it('mostra botão "Avaliar consulta" quando canRate=true e sem avaliação', () => {
		render(
			<AppointmentRatingSection
				appointment={
					{ ...baseAppointment, status: "COMPLETED", rating: null } as never
				}
				canRate={true}
			/>,
		);
		expect(screen.getByText("Avaliar consulta")).toBeInTheDocument();
	});

	it("mostra o formulário de avaliação ao clicar em Avaliar consulta", async () => {
		render(
			<AppointmentRatingSection
				appointment={
					{ ...baseAppointment, status: "COMPLETED", rating: null } as never
				}
				canRate={true}
			/>,
		);
		await userEvent.click(screen.getByText("Avaliar consulta"));
		expect(screen.getByText("mock-rate-appointment-form")).toBeInTheDocument();
	});

	it('mostra "Sem avaliação." quando canRate=false e sem avaliação', () => {
		render(
			<AppointmentRatingSection
				appointment={
					{ ...baseAppointment, status: "COMPLETED", rating: null } as never
				}
				canRate={false}
			/>,
		);
		expect(screen.getByText("Sem avaliação.")).toBeInTheDocument();
	});
});

describe("StarDisplay", () => {
	it("renderiza 5 estrelas", () => {
		const { container } = render(<StarDisplay rating={3} />);
		expect(container.querySelectorAll("svg")).toHaveLength(5);
	});

	it("preenche as estrelas de acordo com o rating", () => {
		const { container } = render(<StarDisplay rating={3} />);
		const stars = container.querySelectorAll("svg");
		expect(stars[0].getAttribute("class")).toContain("fill-amber-400");
		expect(stars[2].getAttribute("class")).toContain("fill-amber-400");
		expect(stars[3].getAttribute("class")).not.toContain("fill-amber-400");
	});

	it("não preenche nenhuma estrela quando rating=0", () => {
		const { container } = render(<StarDisplay rating={0} />);
		const stars = container.querySelectorAll("svg");
		for (const star of stars) {
			expect(star.getAttribute("class")).not.toContain("fill-amber-400");
		}
	});

	it("preenche todas as estrelas quando rating=5", () => {
		const { container } = render(<StarDisplay rating={5} />);
		const stars = container.querySelectorAll("svg");
		for (const star of stars) {
			expect(star.getAttribute("class")).toContain("fill-amber-400");
		}
	});
});

describe("QrCodeDialog", () => {
	it("mostra mensagem de carregamento enquanto isLoading=true", () => {
		vi.mocked(useCheckInToken).mockReturnValue({
			data: undefined,
			isLoading: true,
		} as never);
		render(<QrCodeDialog appointmentId="a-1" />);
		expect(screen.getByText("Gerando código...")).toBeInTheDocument();
	});

	it("mostra mensagem de erro quando não há dados", () => {
		vi.mocked(useCheckInToken).mockReturnValue({
			data: undefined,
			isLoading: false,
		} as never);
		render(<QrCodeDialog appointmentId="a-1" />);
		expect(screen.getByText("Erro ao gerar código.")).toBeInTheDocument();
	});

	it("renderiza o QR code quando os dados estão disponíveis", () => {
		vi.mocked(useCheckInToken).mockReturnValue({
			data: { token: "abc123" },
			isLoading: false,
		} as never);
		const { container } = render(<QrCodeDialog appointmentId="a-1" />);
		expect(container.querySelector("svg")).toBeInTheDocument();
		expect(
			screen.getByText("Válido por 1 hora. Apresente à recepção ao chegar."),
		).toBeInTheDocument();
	});
});
