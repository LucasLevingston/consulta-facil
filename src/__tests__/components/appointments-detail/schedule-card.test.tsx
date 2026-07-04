import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth", () => ({
	usePermission: vi.fn(),
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
vi.mock("@/components/forms/Appointments/RescheduleAppointmentForm", () => ({
	RescheduleAppointmentForm: () => <div>mock-reschedule-form</div>,
}));
vi.mock("@/components/appointments/detail/QrCodeDialog", () => ({
	QrCodeDialog: () => <div>mock-qr-code-dialog</div>,
}));
vi.mock("@/components/appointments/detail/useAppointmentScheduleCard", () => ({
	useAppointmentScheduleCard: vi.fn(),
}));

import { AppointmentScheduleCard } from "@/components/appointments/detail/AppointmentScheduleCard";
import { AppointmentScheduleCardBookingActions } from "@/components/appointments/detail/AppointmentScheduleCardBookingActions";
import { AppointmentScheduleCardInfo } from "@/components/appointments/detail/AppointmentScheduleCardInfo";
import { AppointmentScheduleCardVideoActions } from "@/components/appointments/detail/AppointmentScheduleCardVideoActions";
import { useAppointmentScheduleCard } from "@/components/appointments/detail/useAppointmentScheduleCard";
import { usePermission } from "@/features/auth";

const baseAppointment = {
	id: "a-1",
	status: "CONFIRMED",
	scheduledAt: "2026-07-10T14:00:00Z",
	patientId: "p-1",
	professionalId: "prof-1",
	patientName: "João Silva",
	modality: "IN_PERSON",
} as never;

describe("AppointmentScheduleCardInfo", () => {
	it("renderiza data, horário e modalidade presencial", () => {
		render(
			<AppointmentScheduleCardInfo
				appointment={baseAppointment}
				isOnline={false}
				isProfessional={false}
			/>,
		);
		expect(screen.getByText("Presencial")).toBeInTheDocument();
	});

	it("renderiza Teleconsulta quando isOnline=true", () => {
		render(
			<AppointmentScheduleCardInfo
				appointment={baseAppointment}
				isOnline={true}
				isProfessional={false}
			/>,
		);
		expect(screen.getByText("Teleconsulta")).toBeInTheDocument();
	});

	it("renderiza data original quando previousScheduledAt existe", () => {
		const appt = {
			...baseAppointment,
			previousScheduledAt: "2026-07-01T10:00:00Z",
		};
		render(
			<AppointmentScheduleCardInfo
				appointment={appt as never}
				isOnline={false}
				isProfessional={false}
			/>,
		);
		expect(screen.getByText("Data original")).toBeInTheDocument();
	});

	it("renderiza motivo quando reason existe", () => {
		const appt = { ...baseAppointment, reason: "Dor de garganta" };
		render(
			<AppointmentScheduleCardInfo
				appointment={appt as never}
				isOnline={false}
				isProfessional={false}
			/>,
		);
		expect(screen.getByText("Dor de garganta")).toBeInTheDocument();
	});

	it("renderiza nome do paciente quando isProfessional=true", () => {
		render(
			<AppointmentScheduleCardInfo
				appointment={baseAppointment}
				isOnline={false}
				isProfessional={true}
			/>,
		);
		expect(screen.getByText("João Silva")).toBeInTheDocument();
	});

	it("não renderiza nome do paciente quando isProfessional=false", () => {
		render(
			<AppointmentScheduleCardInfo
				appointment={baseAppointment}
				isOnline={false}
				isProfessional={false}
			/>,
		);
		expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
	});
});

describe("AppointmentScheduleCardVideoActions", () => {
	const baseProps = {
		appointment: baseAppointment,
		isOnline: true,
		isPatient: false,
		isProfessional: true,
		videoRoom: undefined,
		onVideoStart: vi.fn(),
		generatingLink: false,
		creatingRoom: false,
		onGenerateMeetLink: vi.fn(),
		onStartVideoRoom: vi.fn(),
	};

	it('mostra "Entrar na consulta" quando há meetLink', () => {
		render(
			<AppointmentScheduleCardVideoActions
				{...baseProps}
				appointment={
					{ ...baseAppointment, meetLink: "https://meet.example" } as never
				}
			/>,
		);
		expect(screen.getByText("Entrar na consulta")).toBeInTheDocument();
	});

	it('mostra "Gerar link Meet" quando não há meetLink e isProfessional=true', () => {
		render(<AppointmentScheduleCardVideoActions {...baseProps} />);
		expect(screen.getByText("Gerar link Meet")).toBeInTheDocument();
	});

	it("chama onGenerateMeetLink ao clicar em Gerar link Meet", async () => {
		const onGenerateMeetLink = vi.fn();
		render(
			<AppointmentScheduleCardVideoActions
				{...baseProps}
				onGenerateMeetLink={onGenerateMeetLink}
			/>,
		);
		await userEvent.click(screen.getByText("Gerar link Meet"));
		expect(onGenerateMeetLink).toHaveBeenCalled();
	});

	it('mostra "Iniciar teleconsulta" quando status=CONFIRMED e isProfessional=true', () => {
		render(<AppointmentScheduleCardVideoActions {...baseProps} />);
		expect(screen.getByText("Iniciar teleconsulta")).toBeInTheDocument();
	});

	it('mostra "Entrar na consulta" para paciente quando videoRoom existe', () => {
		render(
			<AppointmentScheduleCardVideoActions
				{...baseProps}
				isPatient={true}
				isProfessional={false}
				videoRoom={{ token: "tok" } as never}
			/>,
		);
		expect(screen.getByText("Entrar na consulta")).toBeInTheDocument();
	});

	it("chama onVideoStart ao clicar para entrar como paciente", async () => {
		const onVideoStart = vi.fn();
		render(
			<AppointmentScheduleCardVideoActions
				{...baseProps}
				isPatient={true}
				isProfessional={false}
				videoRoom={{ token: "tok" } as never}
				onVideoStart={onVideoStart}
			/>,
		);
		await userEvent.click(screen.getByText("Entrar na consulta"));
		expect(onVideoStart).toHaveBeenCalledWith("a-1");
	});

	it("não mostra nenhum botão quando isOnline=false", () => {
		render(
			<AppointmentScheduleCardVideoActions {...baseProps} isOnline={false} />,
		);
		expect(screen.queryByText("Gerar link Meet")).not.toBeInTheDocument();
		expect(screen.queryByText("Iniciar teleconsulta")).not.toBeInTheDocument();
	});
});

describe("AppointmentScheduleCardBookingActions", () => {
	function setupPermission(can: boolean) {
		vi.mocked(usePermission).mockReturnValue({
			can: vi.fn(() => can),
			role: "PATIENT",
		} as never);
	}

	it('mostra "QR Check-in" para paciente com status CONFIRMED e presencial', () => {
		setupPermission(true);
		render(
			<AppointmentScheduleCardBookingActions
				appointment={baseAppointment}
				isOnline={false}
				isPatient={true}
				canReschedule={false}
				userId="p-1"
				onQrOpen={vi.fn()}
				onRescheduleOpen={vi.fn()}
			/>,
		);
		expect(screen.getByText("QR Check-in")).toBeInTheDocument();
	});

	it("não mostra QR Check-in quando isOnline=true", () => {
		setupPermission(true);
		render(
			<AppointmentScheduleCardBookingActions
				appointment={baseAppointment}
				isOnline={true}
				isPatient={true}
				canReschedule={false}
				userId="p-1"
				onQrOpen={vi.fn()}
				onRescheduleOpen={vi.fn()}
			/>,
		);
		expect(screen.queryByText("QR Check-in")).not.toBeInTheDocument();
	});

	it("chama onQrOpen ao clicar em QR Check-in", async () => {
		setupPermission(true);
		const onQrOpen = vi.fn();
		render(
			<AppointmentScheduleCardBookingActions
				appointment={baseAppointment}
				isOnline={false}
				isPatient={true}
				canReschedule={false}
				userId="p-1"
				onQrOpen={onQrOpen}
				onRescheduleOpen={vi.fn()}
			/>,
		);
		await userEvent.click(screen.getByText("QR Check-in"));
		expect(onQrOpen).toHaveBeenCalled();
	});

	it("mostra Remarcar quando canReschedule=true e permissão concedida", () => {
		setupPermission(true);
		render(
			<AppointmentScheduleCardBookingActions
				appointment={baseAppointment}
				isOnline={false}
				isPatient={true}
				canReschedule={true}
				userId="p-1"
				onQrOpen={vi.fn()}
				onRescheduleOpen={vi.fn()}
			/>,
		);
		expect(screen.getByText("Remarcar")).toBeInTheDocument();
	});

	it("não mostra Remarcar quando a permissão é negada", () => {
		setupPermission(false);
		render(
			<AppointmentScheduleCardBookingActions
				appointment={baseAppointment}
				isOnline={false}
				isPatient={true}
				canReschedule={true}
				userId="p-1"
				onQrOpen={vi.fn()}
				onRescheduleOpen={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Remarcar")).not.toBeInTheDocument();
	});

	it("chama onRescheduleOpen ao clicar em Remarcar", async () => {
		setupPermission(true);
		const onRescheduleOpen = vi.fn();
		render(
			<AppointmentScheduleCardBookingActions
				appointment={baseAppointment}
				isOnline={false}
				isPatient={true}
				canReschedule={true}
				userId="p-1"
				onQrOpen={vi.fn()}
				onRescheduleOpen={onRescheduleOpen}
			/>,
		);
		await userEvent.click(screen.getByText("Remarcar"));
		expect(onRescheduleOpen).toHaveBeenCalled();
	});
});

describe("AppointmentScheduleCard", () => {
	function setup() {
		vi.mocked(useAppointmentScheduleCard).mockReturnValue({
			qrOpen: false,
			setQrOpen: vi.fn(),
			rescheduleOpen: false,
			setRescheduleOpen: vi.fn(),
			generatingLink: false,
			creatingRoom: false,
			onGenerateMeetLink: vi.fn(),
			handleStartVideoRoom: vi.fn(),
		} as never);
		vi.mocked(usePermission).mockReturnValue({
			can: vi.fn(() => true),
			role: "PATIENT",
		} as never);
	}

	it("renderiza o título Agendamento", () => {
		setup();
		render(
			<AppointmentScheduleCard
				appointment={baseAppointment}
				isPatient={true}
				isProfessional={false}
				userId="p-1"
				canReschedule={false}
				videoRoom={undefined}
				onVideoStart={vi.fn()}
			/>,
		);
		expect(screen.getByText("Agendamento")).toBeInTheDocument();
	});

	it("renderiza data/horário via AppointmentScheduleCardInfo", () => {
		setup();
		render(
			<AppointmentScheduleCard
				appointment={baseAppointment}
				isPatient={true}
				isProfessional={false}
				userId="p-1"
				canReschedule={false}
				videoRoom={undefined}
				onVideoStart={vi.fn()}
			/>,
		);
		expect(screen.getByText("Presencial")).toBeInTheDocument();
	});
});
