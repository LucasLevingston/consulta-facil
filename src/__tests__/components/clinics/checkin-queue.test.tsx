import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppointmentResponse } from "@/features/appointments";

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/components/appointments/hooks", () => ({
	useCheckInByQr: vi.fn(),
	useCheckInToken: vi.fn(),
}));

import { toast } from "sonner";
import {
	useCheckInByQr,
	useCheckInToken,
} from "@/components/appointments/hooks";
import { AppointmentCheckInCard } from "@/components/clinics/checkin/AppointmentCheckInCard";
import { CheckInQrSection } from "@/components/clinics/queue/CheckInQrSection";
import { QueueCard } from "@/components/clinics/queue/QueueCard";

const mockUseCheckInByQr = vi.mocked(useCheckInByQr);
const mockUseCheckInToken = vi.mocked(useCheckInToken);

function makeAppointment(
	overrides: Partial<AppointmentResponse> = {},
): AppointmentResponse {
	return {
		id: "appt-1",
		patientId: "patient-1",
		patientName: "Maria Souza",
		professionalId: "prof-1",
		professionalName: "Dr. João",
		specialty: "Cardiologia",
		scheduledAt: "2026-07-04T13:30:00.000Z",
		status: "SCHEDULED",
		...overrides,
	} as AppointmentResponse;
}

describe("AppointmentCheckInCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renderiza o nome do profissional, especialidade e horário", () => {
		mockUseCheckInToken.mockReturnValue({
			data: { token: "tok-123" },
			isLoading: false,
		} as never);
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);

		render(<AppointmentCheckInCard appointment={makeAppointment()} />);

		expect(screen.getByText("Dr. João")).toBeInTheDocument();
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Check-in" }),
		).toBeInTheDocument();
	});

	it("não renderiza a especialidade quando ausente", () => {
		mockUseCheckInToken.mockReturnValue({
			data: { token: "tok-123" },
			isLoading: false,
		} as never);
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);

		render(
			<AppointmentCheckInCard
				appointment={makeAppointment({ specialty: null })}
			/>,
		);

		expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
	});

	it("desabilita o botão de check-in enquanto o token está carregando", () => {
		mockUseCheckInToken.mockReturnValue({
			data: undefined,
			isLoading: true,
		} as never);
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);

		render(<AppointmentCheckInCard appointment={makeAppointment()} />);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("desabilita o botão de check-in quando não há token disponível", () => {
		mockUseCheckInToken.mockReturnValue({
			data: undefined,
			isLoading: false,
		} as never);
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);

		render(<AppointmentCheckInCard appointment={makeAppointment()} />);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("realiza o check-in, mostra o badge 'Na fila' e o toast de sucesso", async () => {
		const user = userEvent.setup();
		const checkIn = vi.fn().mockResolvedValue(undefined);
		mockUseCheckInToken.mockReturnValue({
			data: { token: "tok-123" },
			isLoading: false,
		} as never);
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync: checkIn,
			isPending: false,
		} as never);

		render(<AppointmentCheckInCard appointment={makeAppointment()} />);
		await user.click(screen.getByRole("button", { name: "Check-in" }));

		expect(checkIn).toHaveBeenCalledWith("tok-123");
		expect(await screen.findByText("Na fila")).toBeInTheDocument();
		expect(toast.success).toHaveBeenCalledWith(
			"Check-in realizado! Você está na fila.",
		);
	});

	it("mostra o toast de erro quando o check-in falha", async () => {
		const user = userEvent.setup();
		const checkIn = vi.fn().mockRejectedValue(new Error("falhou"));
		mockUseCheckInToken.mockReturnValue({
			data: { token: "tok-123" },
			isLoading: false,
		} as never);
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync: checkIn,
			isPending: false,
		} as never);

		render(<AppointmentCheckInCard appointment={makeAppointment()} />);
		await user.click(screen.getByRole("button", { name: "Check-in" }));

		expect(
			await screen.findByRole("button", { name: "Check-in" }),
		).toBeInTheDocument();
		expect(toast.error).toHaveBeenCalledWith(
			"Erro ao fazer check-in. Tente novamente.",
		);
	});

	it("mostra o indicador de carregamento enquanto o check-in está pendente", () => {
		mockUseCheckInToken.mockReturnValue({
			data: { token: "tok-123" },
			isLoading: false,
		} as never);
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: true,
		} as never);

		const { container } = render(
			<AppointmentCheckInCard appointment={makeAppointment()} />,
		);
		expect(container.querySelector("svg.animate-spin")).toBeInTheDocument();
	});
});

describe("CheckInQrSection", () => {
	it("renderiza o QR code (svg) para o check-in da clínica", () => {
		const { container } = render(<CheckInQrSection clinicId="clinic-1" />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renderiza o texto explicativo para os pacientes", () => {
		render(<CheckInQrSection clinicId="clinic-1" />);
		expect(
			screen.getByText(
				"Pacientes escaneiam este código com o celular para entrar na fila.",
			),
		).toBeInTheDocument();
		expect(
			screen.getByText("QR Code para check-in dos pacientes"),
		).toBeInTheDocument();
	});
});

describe("QueueCard", () => {
	it("renderiza o nome do profissional e a especialidade", () => {
		render(
			<QueueCard
				professionalName="Dra. Ana"
				specialty="Dermatologia"
				appointments={[]}
			/>,
		);
		expect(screen.getByText("Dra. Ana")).toBeInTheDocument();
		expect(screen.getByText("Dermatologia")).toBeInTheDocument();
	});

	it("mostra mensagem de que ninguém está em atendimento quando não há IN_PROGRESS", () => {
		render(
			<QueueCard
				professionalName="Dra. Ana"
				specialty={null}
				appointments={[]}
			/>,
		);
		expect(
			screen.getByText("Nenhum paciente em atendimento"),
		).toBeInTheDocument();
	});

	it("mostra o paciente em atendimento quando há um appointment IN_PROGRESS", () => {
		render(
			<QueueCard
				professionalName="Dra. Ana"
				specialty="Dermatologia"
				appointments={[
					makeAppointment({
						id: "a1",
						patientName: "Carlos",
						status: "IN_PROGRESS",
						checkedInAt: "2026-07-04T13:00:00.000Z",
					}),
				]}
			/>,
		);
		expect(screen.getByText("Em atendimento")).toBeInTheDocument();
		expect(screen.getByText("Carlos")).toBeInTheDocument();
	});

	it("mostra a fila de espera com a contagem e a ordem dos pacientes", () => {
		render(
			<QueueCard
				professionalName="Dra. Ana"
				specialty="Dermatologia"
				appointments={[
					makeAppointment({
						id: "a1",
						patientName: "Carlos",
						status: "CHECKED_IN",
					}),
					makeAppointment({
						id: "a2",
						patientName: "Bianca",
						status: "CHECKED_IN",
					}),
				]}
			/>,
		);
		expect(screen.getByText("2 aguardando")).toBeInTheDocument();
		expect(screen.getByText("Fila de espera")).toBeInTheDocument();
		expect(screen.getByText("Carlos")).toBeInTheDocument();
		expect(screen.getByText("Bianca")).toBeInTheDocument();
	});

	it("não mostra a seção de fila de espera quando não há pacientes aguardando", () => {
		render(
			<QueueCard
				professionalName="Dra. Ana"
				specialty="Dermatologia"
				appointments={[]}
			/>,
		);
		expect(screen.queryByText("Fila de espera")).not.toBeInTheDocument();
	});
});
