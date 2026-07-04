import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { DetailsStep } from "@/components/forms/Appointments/steps/DetailsStep";
import { ModalityStep } from "@/components/forms/Appointments/steps/ModalityStep";
import { PaymentStep } from "@/components/forms/Appointments/steps/PaymentStep";
import type { ProfessionalResponse } from "@/features/professionals";

function makeProfessional(
	overrides: Partial<ProfessionalResponse> = {},
): ProfessionalResponse {
	return {
		id: "prof-1",
		name: "Dra. Ana Silva",
		acceptedPaymentMethods: ["PIX", "CREDIT_CARD"],
		paymentTiming: "AT_SCHEDULING",
		...overrides,
	} as unknown as ProfessionalResponse;
}

describe("ModalityStep", () => {
	function Wrapper({ defaultModality }: { defaultModality?: string } = {}) {
		const form = useForm<{ modality: string | undefined }>({
			defaultValues: { modality: defaultModality },
		});

		return (
			<FormProvider {...form}>
				<ModalityStep control={form.control as never} />
				<span data-testid="modality-value">{form.watch("modality")}</span>
			</FormProvider>
		);
	}

	it("renderiza o título 'Modalidade'", () => {
		render(<Wrapper />);

		expect(screen.getByText("Modalidade")).toBeInTheDocument();
	});

	it("renderiza as opções Presencial e Online com suas descrições", () => {
		render(<Wrapper />);

		expect(screen.getByText("Presencial")).toBeInTheDocument();
		expect(screen.getByText("Na clínica ou consultório")).toBeInTheDocument();
		expect(screen.getByText("Online")).toBeInTheDocument();
		expect(
			screen.getByText("Videochamada via Google Meet"),
		).toBeInTheDocument();
	});

	it("propaga a seleção da modalidade para o form ao clicar em uma opção", async () => {
		const user = userEvent.setup();
		render(<Wrapper />);

		await user.click(screen.getByText("Online"));

		expect(screen.getByTestId("modality-value")).toHaveTextContent("ONLINE");
	});

	it("troca a modalidade selecionada ao clicar em outra opção", async () => {
		const user = userEvent.setup();
		render(<Wrapper defaultModality="ONLINE" />);

		await user.click(screen.getByText("Presencial"));

		expect(screen.getByTestId("modality-value")).toHaveTextContent("IN_PERSON");
	});
});

describe("PaymentStep", () => {
	function Wrapper({
		selectedProfessional,
		defaultMethod,
	}: {
		selectedProfessional: ProfessionalResponse;
		defaultMethod?: string;
	}) {
		const form = useForm<{ chosenPaymentMethod: string | undefined }>({
			defaultValues: { chosenPaymentMethod: defaultMethod },
		});

		return (
			<FormProvider {...form}>
				<div data-testid="payment-step-content">
					<PaymentStep
						control={form.control as never}
						selectedProfessional={selectedProfessional}
					/>
				</div>
				<span data-testid="payment-method-value">
					{form.watch("chosenPaymentMethod") ?? ""}
				</span>
			</FormProvider>
		);
	}

	it("não renderiza nada quando o profissional não aceita nenhum método de pagamento", () => {
		render(
			<Wrapper
				selectedProfessional={makeProfessional({ acceptedPaymentMethods: [] })}
			/>,
		);

		expect(screen.getByTestId("payment-step-content")).toBeEmptyDOMElement();
	});

	it("mostra alerta de pagamento presencial quando paymentTiming é AT_CONSULTATION", () => {
		render(
			<Wrapper
				selectedProfessional={makeProfessional({
					paymentTiming: "AT_CONSULTATION",
				})}
			/>,
		);

		expect(
			screen.getByText(
				"O pagamento é realizado presencialmente no dia da consulta.",
			),
		).toBeInTheDocument();
	});

	it("mostra alerta de pagamento no agendamento quando paymentTiming é AT_SCHEDULING", () => {
		render(
			<Wrapper
				selectedProfessional={makeProfessional({
					paymentTiming: "AT_SCHEDULING",
				})}
			/>,
		);

		expect(
			screen.getByText(
				"Este profissional exige pagamento no momento do agendamento.",
			),
		).toBeInTheDocument();
	});

	it("renderiza os métodos de pagamento aceitos com os labels corretos", () => {
		render(
			<Wrapper
				selectedProfessional={makeProfessional({
					acceptedPaymentMethods: ["PIX", "MERCADOPAGO", "CASH"],
				})}
			/>,
		);

		expect(screen.getByText("Pix")).toBeInTheDocument();
		expect(screen.getByText("MercadoPago")).toBeInTheDocument();
		expect(screen.getByText("Dinheiro")).toBeInTheDocument();
	});

	it("seleciona um método de pagamento ao clicar e propaga para o form", async () => {
		const user = userEvent.setup();
		render(
			<Wrapper
				selectedProfessional={makeProfessional({
					acceptedPaymentMethods: ["PIX", "CREDIT_CARD"],
				})}
			/>,
		);

		await user.click(screen.getByText("Pix"));

		expect(screen.getByTestId("payment-method-value")).toHaveTextContent("PIX");
	});

	it("desmarca o método ao clicar novamente no mesmo método já selecionado", async () => {
		const user = userEvent.setup();
		render(
			<Wrapper
				selectedProfessional={makeProfessional({
					acceptedPaymentMethods: ["PIX", "CREDIT_CARD"],
				})}
				defaultMethod="PIX"
			/>,
		);

		await user.click(screen.getByText("Pix"));

		expect(screen.getByTestId("payment-method-value")).toHaveTextContent("");
	});
});

describe("DetailsStep", () => {
	function Wrapper() {
		const form = useForm<{
			reason: string | undefined;
			notes: string | undefined;
		}>({
			defaultValues: { reason: "", notes: "" },
		});

		return (
			<FormProvider {...form}>
				<DetailsStep control={form.control as never} />
			</FormProvider>
		);
	}

	it("renderiza o título 'Detalhes' e o badge 'Opcional'", () => {
		render(<Wrapper />);

		expect(screen.getByText("Detalhes")).toBeInTheDocument();
		expect(screen.getByText("Opcional")).toBeInTheDocument();
	});

	it("renderiza os rótulos 'Motivo da consulta' e 'Observações adicionais'", () => {
		render(<Wrapper />);

		expect(screen.getByText("Motivo da consulta")).toBeInTheDocument();
		expect(screen.getByText("Observações adicionais")).toBeInTheDocument();
	});

	it("mostra o contador de caracteres do motivo iniciando em 0/500", () => {
		render(<Wrapper />);

		expect(screen.getByText("0/500")).toBeInTheDocument();
	});

	it("atualiza o contador de caracteres ao digitar no motivo da consulta", async () => {
		const user = userEvent.setup();
		render(<Wrapper />);

		await user.type(
			screen.getByPlaceholderText(
				"Ex.: dor de cabeça frequente, check-up anual, retorno...",
			),
			"Dor de cabeça",
		);

		expect(screen.getByText("13/500")).toBeInTheDocument();
	});

	it("permite digitar nas observações adicionais", async () => {
		const user = userEvent.setup();
		render(<Wrapper />);

		const notesField = screen.getByPlaceholderText(
			"Informações relevantes, alergias, medicações em uso...",
		);
		await user.type(notesField, "Alérgico a dipirona");

		expect(notesField).toHaveValue("Alérgico a dipirona");
	});
});
