import { render, screen } from "@testing-library/react";
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
vi.mock("@/store/useUserStore", () => ({
	useUserStore: vi.fn(),
}));
vi.mock("@/hooks/api/appointments/use-patient-appointments", () => ({
	usePatientAppointments: vi.fn(),
}));
vi.mock("@/hooks/api/appointments/use-professional-appointments", () => ({
	useProfessionalAppointments: vi.fn(),
}));
vi.mock("@/hooks/api/appointments/use-confirm-appointment", () => ({
	useConfirmAppointment: vi.fn(),
}));
vi.mock("@/hooks/api/appointments/use-complete-appointment", () => ({
	useCompleteAppointment: vi.fn(),
}));
vi.mock("@/hooks/api/doctors/use-my-professional-profile", () => ({
	useMyProfessionalProfile: vi.fn(),
}));
vi.mock("@/components/custom/dashboard/appointments-list", () => ({
	AppointmentsList: ({ isProfessional }: { isProfessional: boolean }) => (
		<div data-testid="appointments-list">
			{isProfessional ? "professional-list" : "patient-list"}
		</div>
	),
}));
vi.mock("@/components/custom/dashboard/stat-card", () => ({
	StatCard: ({ label, count }: { label: string; count: number }) => (
		<div data-testid="stat-card">
			{label}: {count}
		</div>
	),
}));

import { Dashboard } from "@/components/custom/dashboard/Dashboard";
import { useCompleteAppointment } from "@/hooks/api/appointments/use-complete-appointment";
import { useConfirmAppointment } from "@/hooks/api/appointments/use-confirm-appointment";
import { usePatientAppointments } from "@/hooks/api/appointments/use-patient-appointments";
import { useProfessionalAppointments } from "@/hooks/api/appointments/use-professional-appointments";
import { useMyProfessionalProfile } from "@/hooks/api/doctors/use-my-professional-profile";
import { useUserStore } from "@/store/useUserStore";

const mockUseUserStore = vi.mocked(useUserStore);
const mockUsePatientAppointments = vi.mocked(usePatientAppointments);
const mockUseProfessionalAppointments = vi.mocked(useProfessionalAppointments);
const mockUseConfirmAppointment = vi.mocked(useConfirmAppointment);
const mockUseCompleteAppointment = vi.mocked(useCompleteAppointment);
const mockUseMyProfessionalProfile = vi.mocked(useMyProfessionalProfile);

const emptyPage = { data: { content: [], totalPages: 0, totalElements: 0 } };

function setupMocks(role: string, userId = "u-1") {
	mockUseUserStore.mockReturnValue({ user: { id: userId, role } } as never);
	mockUsePatientAppointments.mockReturnValue(emptyPage as never);
	mockUseProfessionalAppointments.mockReturnValue(emptyPage as never);
	mockUseConfirmAppointment.mockReturnValue({ mutateAsync: vi.fn() } as never);
	mockUseCompleteAppointment.mockReturnValue({ mutateAsync: vi.fn() } as never);
	mockUseMyProfessionalProfile.mockReturnValue({ data: null } as never);
}

describe("Dashboard", () => {
	beforeEach(() => vi.clearAllMocks());

	it("renders greeting for PATIENT", () => {
		setupMocks("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getByText("Olá, João!")).toBeInTheDocument();
	});

	it("renders 'Bem-vindo de volta' hero label for patient", () => {
		setupMocks("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();
	});

	it("renders 'Painel do profissional' for PROFESSIONAL", () => {
		setupMocks("PROFESSIONAL");
		render(<Dashboard firstName="Dra. Ana" userRole="PROFESSIONAL" />);
		expect(screen.getByText("Painel do profissional")).toBeInTheDocument();
	});

	it("renders 'Painel administrativo' for ADMIN", () => {
		setupMocks("ADMIN");
		render(<Dashboard firstName="Admin" userRole="ADMIN" />);
		expect(screen.getByText("Painel administrativo")).toBeInTheDocument();
	});

	it("shows stat cards for PATIENT", () => {
		setupMocks("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getAllByTestId("stat-card").length).toBeGreaterThan(0);
	});

	it("shows stat cards for PROFESSIONAL", () => {
		setupMocks("PROFESSIONAL");
		render(<Dashboard firstName="Dra. Ana" userRole="PROFESSIONAL" />);
		expect(screen.getAllByTestId("stat-card").length).toBeGreaterThan(0);
	});

	it("does not show stat cards for ADMIN", () => {
		setupMocks("ADMIN");
		render(<Dashboard firstName="Admin" userRole="ADMIN" />);
		expect(screen.queryAllByTestId("stat-card")).toHaveLength(0);
	});

	it("shows 'O que você quer fazer hoje?' for patient", () => {
		setupMocks("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getByText("O que você quer fazer hoje?")).toBeInTheDocument();
	});

	it("shows patient CTA for PATIENT", () => {
		setupMocks("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getByText("É profissional de saúde?")).toBeInTheDocument();
	});

	it("does not show patient CTA for PROFESSIONAL", () => {
		setupMocks("PROFESSIONAL");
		render(<Dashboard firstName="Dra. Ana" userRole="PROFESSIONAL" />);
		expect(
			screen.queryByText("É profissional de saúde?"),
		).not.toBeInTheDocument();
	});

	it("shows quick access cards for PATIENT", () => {
		setupMocks("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getByText("Agendar Consulta")).toBeInTheDocument();
	});

	it("shows admin cards for ADMIN", () => {
		setupMocks("ADMIN");
		render(<Dashboard firstName="Admin" userRole="ADMIN" />);
		expect(screen.getByText("Painel Admin")).toBeInTheDocument();
	});
});
