import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value?: string;
	}) => (
		<div data-testid="select" data-value={value}>
			{children}
		</div>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: () => null,
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <div data-value={value}>{children}</div>,
}));

const mockUseClinicAppointments = vi.fn();
vi.mock("./use-clinic-appointments", () => ({
	useClinicAppointments: (ids: string[]) => mockUseClinicAppointments(ids),
}));

import type { AppointmentResponse } from "@/features/appointments";
import type { ClinicResponse } from "@/features/clinics";
import { ClinicAppointmentCard } from "./ClinicAppointmentCard";
import { ClinicAppointmentsFilterBar } from "./ClinicAppointmentsFilterBar";
import { ClinicAppointmentsTab } from "./ClinicAppointmentsTab";

const baseAppt = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "prof-1",
	patientName: "Maria Silva",
	professionalName: "Dr. João",
	specialty: "CARDIOLOGIA",
	scheduledAt: "2026-01-10T14:30:00",
	status: "CONFIRMED",
} as unknown as AppointmentResponse;

const members = [
	{
		professionalProfileId: "prof-1",
		professionalName: "Dr. João",
		specialty: "CARDIOLOGIA",
		role: "OWNER",
	},
	{
		professionalProfileId: "prof-2",
		professionalName: null,
		specialty: "ORTOPEDIA",
		role: "MEMBER",
	},
] as unknown as ClinicResponse["members"];

describe("ClinicAppointmentCard", () => {
	it("renders nome do paciente e status", () => {
		render(<ClinicAppointmentCard appt={baseAppt} />);
		expect(screen.getByText("Maria Silva")).toBeInTheDocument();
		expect(screen.getByText("Confirmada")).toBeInTheDocument();
	});

	it("renders profissional e especialidade", () => {
		render(<ClinicAppointmentCard appt={baseAppt} />);
		expect(screen.getByText(/Dr\. João/)).toBeInTheDocument();
		expect(screen.getByText(/Cardiologia/)).toBeInTheDocument();
	});

	it("renders data formatada", () => {
		render(<ClinicAppointmentCard appt={baseAppt} />);
		expect(screen.getByText(/2026/)).toBeInTheDocument();
	});

	it("usa fallback 'Paciente' quando patientName é nulo", () => {
		render(
			<ClinicAppointmentCard
				appt={
					{ ...baseAppt, patientName: null } as unknown as AppointmentResponse
				}
			/>,
		);
		expect(screen.getByText("Paciente")).toBeInTheDocument();
	});

	it("usa fallback '—' quando professionalName e specialty são nulos", () => {
		render(
			<ClinicAppointmentCard
				appt={
					{
						...baseAppt,
						professionalName: null,
						specialty: null,
					} as unknown as AppointmentResponse
				}
			/>,
		);
		expect(screen.getByText("— · —")).toBeInTheDocument();
	});
});

describe("ClinicAppointmentsFilterBar", () => {
	const base = {
		isManager: false,
		members: members as NonNullable<ClinicResponse["members"]>,
		filterProfessionalId: "__all__",
		filterStatus: "__all__",
		filteredCount: 3,
		onProfessionalChange: vi.fn(),
		onStatusChange: vi.fn(),
	};

	it("mostra select de profissionais quando isManager=true", () => {
		render(<ClinicAppointmentsFilterBar {...base} isManager={true} />);
		expect(screen.getByText("Dr. João")).toBeInTheDocument();
	});

	it("esconde select de profissionais quando isManager=false", () => {
		render(<ClinicAppointmentsFilterBar {...base} isManager={false} />);
		expect(screen.queryByText("Dr. João")).not.toBeInTheDocument();
	});

	it("usa label de especialidade quando membro não tem nome", () => {
		render(<ClinicAppointmentsFilterBar {...base} isManager={true} />);
		expect(screen.getByText("Ortopedia")).toBeInTheDocument();
	});

	it("renders contagem de consultas no plural", () => {
		render(<ClinicAppointmentsFilterBar {...base} filteredCount={3} />);
		expect(screen.getByText("3 consultas")).toBeInTheDocument();
	});

	it("renders contagem de consultas no singular", () => {
		render(<ClinicAppointmentsFilterBar {...base} filteredCount={1} />);
		expect(screen.getByText("1 consulta")).toBeInTheDocument();
	});

	it("renders todas as opções de status", () => {
		render(<ClinicAppointmentsFilterBar {...base} />);
		expect(screen.getByText("Pendente")).toBeInTheDocument();
		expect(screen.getByText("Concluída")).toBeInTheDocument();
	});
});

describe("ClinicAppointmentsTab", () => {
	const clinic = {
		id: "c-1",
		members: members as NonNullable<ClinicResponse["members"]>,
	} as unknown as ClinicResponse;

	it("renders spinner de loading enquanto carrega", () => {
		mockUseClinicAppointments.mockReturnValue({
			appointments: [],
			isLoading: true,
		});
		const { container } = render(
			<ClinicAppointmentsTab clinic={clinic} isManager={true} />,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders estado vazio quando não há consultas", () => {
		mockUseClinicAppointments.mockReturnValue({
			appointments: [],
			isLoading: false,
		});
		render(<ClinicAppointmentsTab clinic={clinic} isManager={true} />);
		expect(screen.getByText("Nenhuma consulta encontrada")).toBeInTheDocument();
	});

	it("renders lista de consultas quando há dados", () => {
		mockUseClinicAppointments.mockReturnValue({
			appointments: [baseAppt],
			isLoading: false,
		});
		render(<ClinicAppointmentsTab clinic={clinic} isManager={true} />);
		expect(screen.getByText("Maria Silva")).toBeInTheDocument();
		expect(screen.getByText("1 consulta")).toBeInTheDocument();
	});

	it("ordena consultas por data mais recente primeiro", () => {
		const older = {
			...baseAppt,
			id: "a-2",
			patientName: "Antiga",
			scheduledAt: "2020-01-01T10:00:00",
		} as unknown as AppointmentResponse;
		const newer = {
			...baseAppt,
			id: "a-3",
			patientName: "Recente",
			scheduledAt: "2030-01-01T10:00:00",
		} as unknown as AppointmentResponse;
		mockUseClinicAppointments.mockReturnValue({
			appointments: [older, newer],
			isLoading: false,
		});
		render(<ClinicAppointmentsTab clinic={clinic} isManager={true} />);
		const names = screen
			.getAllByText(/Antiga|Recente/)
			.map((el) => el.textContent);
		expect(names).toEqual(["Recente", "Antiga"]);
	});

	it("usa myProfessionalProfileId quando isManager=false", () => {
		mockUseClinicAppointments.mockReturnValue({
			appointments: [],
			isLoading: false,
		});
		render(
			<ClinicAppointmentsTab
				clinic={clinic}
				isManager={false}
				myProfessionalProfileId="prof-2"
			/>,
		);
		expect(mockUseClinicAppointments).toHaveBeenCalledWith(["prof-2"]);
	});
});
