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
vi.mock("@/features/professionals", () => ({
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
import {
	useCompleteAppointment,
	useConfirmAppointment,
	usePatientAppointments,
	useProfessionalAppointments,
} from "@/features/appointments";
import { useUserStore } from "@/features/auth";
import { useMyProfessionalProfile } from "@/features/professionals";

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

describe("Dashboard content", () => {
	beforeEach(() => vi.clearAllMocks());

	it("shows CTA section for patient", () => {
		setup("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getByText("O que você quer fazer hoje?")).toBeInTheDocument();
	});

	it("shows patient CTA for PATIENT", () => {
		setup("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getByText("É profissional de saúde?")).toBeInTheDocument();
	});

	it("does not show patient CTA for PROFESSIONAL", () => {
		setup("PROFESSIONAL");
		render(<Dashboard firstName="Dra. Ana" userRole="PROFESSIONAL" />);
		expect(
			screen.queryByText("É profissional de saúde?"),
		).not.toBeInTheDocument();
	});

	it("shows quick access cards for PATIENT", () => {
		setup("PATIENT");
		render(<Dashboard firstName="João" userRole="PATIENT" />);
		expect(screen.getByText("Agendar Consulta")).toBeInTheDocument();
	});

	it("shows admin cards for ADMIN", () => {
		setup("ADMIN");
		render(<Dashboard firstName="Admin" userRole="ADMIN" />);
		expect(screen.getByText("Painel Admin")).toBeInTheDocument();
	});
});
