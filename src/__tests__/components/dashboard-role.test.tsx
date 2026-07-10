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
vi.mock("@/features/auth", () => ({ useUserStore: vi.fn() }));
vi.mock("@/features/appointments", () => ({
	usePatientAppointments: vi.fn(),
	useProfessionalAppointments: vi.fn(),
	useConfirmAppointment: vi.fn(),
	useCompleteAppointment: vi.fn(),
}));
vi.mock("@/components/professionals/hooks", () => ({
	useMyProfessionalProfile: vi.fn(),
}));
vi.mock("@/components/custom/dashboard/appointments-list", () => ({
	AppointmentsList: ({ isProfessional }: { isProfessional: boolean }) => (
		<div data-testid="appointments-list">
			{isProfessional ? "pro" : "patient"}
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
import { useMyProfessionalProfile } from "@/components/professionals/hooks";
import {
	useCompleteAppointment,
	useConfirmAppointment,
	usePatientAppointments,
	useProfessionalAppointments,
} from "@/features/appointments";
import { useUserStore } from "@/features/auth";

const emptyPage = { data: { content: [], totalPages: 0, totalElements: 0 } };

function setup(role: string) {
	vi.mocked(useUserStore).mockReturnValue({
		user: { id: "u-1", role },
	} as never);
	vi.mocked(usePatientAppointments).mockReturnValue(emptyPage as never);
	vi.mocked(useProfessionalAppointments).mockReturnValue(emptyPage as never);
	vi.mocked(useConfirmAppointment).mockReturnValue({
		mutateAsync: vi.fn(),
	} as never);
	vi.mocked(useCompleteAppointment).mockReturnValue({
		mutateAsync: vi.fn(),
	} as never);
	vi.mocked(useMyProfessionalProfile).mockReturnValue({ data: null } as never);
}

describe("Dashboard role headings", () => {
	beforeEach(() => vi.clearAllMocks());

	it("renders greeting for PATIENT", () => {
		setup("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getByText("Olá, João!")).toBeInTheDocument();
	});

	it("renders hero label for patient", () => {
		setup("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();
	});

	it("renders professional heading", () => {
		setup("PROFESSIONAL");
		render(<Dashboard firstName="Dra. Ana" userRole="PROFESSIONAL" />);
		expect(screen.getByText("Painel do profissional")).toBeInTheDocument();
	});

	it("renders admin heading", () => {
		setup("ADMIN");
		render(<Dashboard firstName="Admin" userRole="ADMIN" />);
		expect(screen.getByText("Painel administrativo")).toBeInTheDocument();
	});

	it("shows stat cards for PATIENT", () => {
		setup("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getAllByTestId("stat-card").length).toBeGreaterThan(0);
	});

	it("shows stat cards for PROFESSIONAL", () => {
		setup("PROFESSIONAL");
		render(<Dashboard firstName="Dra. Ana" userRole="PROFESSIONAL" />);
		expect(screen.getAllByTestId("stat-card").length).toBeGreaterThan(0);
	});

	it("does not show stat cards for ADMIN", () => {
		setup("ADMIN");
		render(<Dashboard firstName="Admin" userRole="ADMIN" />);
		expect(screen.queryAllByTestId("stat-card")).toHaveLength(0);
	});
});
