import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/auth/hooks", () => ({
	usePermission: vi.fn(),
}));
vi.mock("@/features/auth", () => ({
	useUserStore: vi.fn(),
}));
vi.mock("@/components/appointments/detail/use-room-token", () => ({
	useRoomToken: vi.fn(),
}));
vi.mock("@/components/custom/video-room", () => ({
	VideoRoom: () => <div>mock-video-room</div>,
}));
vi.mock("@/components/forms/Appointments/ExamsSection", () => ({
	ExamsSection: () => <div>mock-exams-section</div>,
}));
vi.mock("@/components/appointments/detail/AnamnesisSection", () => ({
	AnamnesisSection: () => <div>mock-anamnesis-section</div>,
}));
vi.mock("@/components/appointments/detail/ProntuarioSection", () => ({
	ProntuarioSection: () => <div>mock-prontuario-section</div>,
}));
vi.mock("@/components/appointments/detail/AppointmentCancellationCard", () => ({
	AppointmentCancellationCard: ({ reason }: { reason: string }) => (
		<div>mock-cancellation-card:{reason}</div>
	),
}));
vi.mock("@/components/appointments/detail/AppointmentPaymentSection", () => ({
	AppointmentPaymentSection: () => <div>mock-payment-section</div>,
}));
vi.mock("@/components/appointments/detail/AppointmentRatingSection", () => ({
	AppointmentRatingSection: () => <div>mock-rating-section</div>,
}));
vi.mock("@/components/appointments/detail/AppointmentScheduleCard", () => ({
	AppointmentScheduleCard: ({
		appointment,
		onVideoStart,
	}: {
		appointment: { id: string };
		onVideoStart: (id: string) => void;
	}) => (
		<div>
			mock-schedule-card
			<button type="button" onClick={() => onVideoStart(appointment.id)}>
				iniciar-video-teste
			</button>
		</div>
	),
}));

import { AppointmentDetail } from "@/components/appointments/detail/AppointmentDetail";
import { useRoomToken } from "@/components/appointments/detail/use-room-token";
import { usePermission } from "@/components/auth/hooks";
import { useUserStore } from "@/features/auth";

const baseAppointment = {
	id: "a-1",
	status: "CONFIRMED",
	scheduledAt: "2026-07-10T14:00:00Z",
	patientId: "p-1",
	professionalId: "prof-1",
	professionalName: "Dra. Ana Costa",
	specialty: "CARDIOLOGY",
	modality: "IN_PERSON",
} as never;

function setup(opts?: {
	role?: string;
	videoRoomData?: unknown;
	appointment?: Record<string, unknown>;
}) {
	vi.mocked(useUserStore).mockReturnValue({
		user: { id: "p-1", role: opts?.role ?? "PATIENT" },
	} as never);
	vi.mocked(usePermission).mockReturnValue({
		can: vi.fn(() => true),
		role: opts?.role ?? "PATIENT",
	} as never);
	vi.mocked(useRoomToken).mockReturnValue({
		data: opts?.videoRoomData,
	} as never);
}

describe("AppointmentDetail", () => {
	it("renderiza o cabeçalho da consulta", () => {
		setup();
		render(<AppointmentDetail appointment={baseAppointment} />);
		expect(screen.getByText("Detalhes da consulta")).toBeInTheDocument();
	});

	it("renderiza o card do profissional", () => {
		setup();
		render(<AppointmentDetail appointment={baseAppointment} />);
		expect(screen.getByText("Dra. Ana Costa")).toBeInTheDocument();
	});

	it("renderiza as seções de anamnese, prontuário, agendamento e exames", () => {
		setup();
		render(<AppointmentDetail appointment={baseAppointment} />);
		expect(screen.getByText("mock-anamnesis-section")).toBeInTheDocument();
		expect(screen.getByText("mock-prontuario-section")).toBeInTheDocument();
		expect(screen.getByText("mock-schedule-card")).toBeInTheDocument();
		expect(screen.getByText("mock-exams-section")).toBeInTheDocument();
		expect(screen.getByText("mock-rating-section")).toBeInTheDocument();
	});

	it("renderiza a seção de pagamento quando o usuário é paciente", () => {
		setup({ role: "PATIENT" });
		render(<AppointmentDetail appointment={baseAppointment} />);
		expect(screen.getByText("mock-payment-section")).toBeInTheDocument();
	});

	it("não renderiza a seção de pagamento quando o usuário é profissional", () => {
		setup({ role: "PROFESSIONAL" });
		render(<AppointmentDetail appointment={baseAppointment} />);
		expect(screen.queryByText("mock-payment-section")).not.toBeInTheDocument();
	});

	it("renderiza o card de cancelamento quando status=CANCELED e há motivo", () => {
		setup();
		render(
			<AppointmentDetail
				appointment={
					{
						...baseAppointment,
						status: "CANCELED",
						cancellationReason: "Paciente desistiu",
					} as never
				}
			/>,
		);
		expect(
			screen.getByText("mock-cancellation-card:Paciente desistiu"),
		).toBeInTheDocument();
	});

	it("não renderiza o card de cancelamento quando status diferente de CANCELED", () => {
		setup();
		render(<AppointmentDetail appointment={baseAppointment} />);
		expect(
			screen.queryByText(/mock-cancellation-card/),
		).not.toBeInTheDocument();
	});

	it("inicia a sala de vídeo ao acionar onVideoStart do card de agendamento", async () => {
		setup({ videoRoomData: { token: "tok", roomUrl: "https://x" } });
		render(<AppointmentDetail appointment={baseAppointment} />);
		expect(screen.queryByText("mock-video-room")).not.toBeInTheDocument();
		await userEvent.click(screen.getByText("iniciar-video-teste"));
		expect(screen.getByText("mock-video-room")).toBeInTheDocument();
	});
});
