import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
const mockUseSearchParams = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: mockReplace }),
	useSearchParams: () => mockUseSearchParams(),
}));

const mockUsePatientProfile = vi.fn();
const mockUseMedicalRecords = vi.fn();
vi.mock("@/components/patients/detail/use-patient-profile", () => ({
	usePatientProfile: (...args: unknown[]) => mockUsePatientProfile(...args),
}));
vi.mock("@/components/patients/hooks", () => ({
	useMedicalRecords: (...args: unknown[]) => mockUseMedicalRecords(...args),
}));

const mockUsePatientAppointments = vi.fn();
vi.mock("@/features/appointments", () => ({
	usePatientAppointments: (...args: unknown[]) =>
		mockUsePatientAppointments(...args),
}));

vi.mock("@/components/patients/detail/PatientProfileCard", () => ({
	PatientProfileCard: ({
		patient,
		appointmentsCount,
	}: {
		patient: { name: string };
		appointmentsCount: number;
	}) => (
		<div>
			profile-card:{patient.name}:{appointmentsCount}
		</div>
	),
}));
vi.mock("@/components/patients/detail/PatientScoreCard", () => ({
	PatientScoreCard: () => <div>score-card</div>,
}));
vi.mock("@/components/patients/detail/PatientDetailTabs", () => ({
	PatientDetailTabs: ({ activeTab }: { activeTab: string }) => (
		<div>tabs:{activeTab}</div>
	),
}));

import { PatientDetailContent } from "@/components/patients/detail/PatientDetailContent";

describe("PatientDetailContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
	});

	it("mostra skeletons enquanto os dados estão carregando", () => {
		mockUsePatientProfile.mockReturnValue({
			data: undefined,
			isLoading: true,
		});
		mockUsePatientAppointments.mockReturnValue({
			data: undefined,
			isLoading: true,
		});
		mockUseMedicalRecords.mockReturnValue({
			data: undefined,
			isLoading: true,
		});
		const { container } = render(<PatientDetailContent id="p-1" />);
		expect(
			container.querySelectorAll('[data-slot="skeleton"]').length,
		).toBeGreaterThan(0);
		expect(screen.queryByText(/profile-card/)).not.toBeInTheDocument();
	});

	it("mostra mensagem de paciente não encontrado quando não há dados", () => {
		mockUsePatientProfile.mockReturnValue({
			data: undefined,
			isLoading: false,
		});
		mockUsePatientAppointments.mockReturnValue({
			data: undefined,
			isLoading: false,
		});
		mockUseMedicalRecords.mockReturnValue({
			data: undefined,
			isLoading: false,
		});
		render(<PatientDetailContent id="p-1" />);
		expect(screen.getByText("Paciente não encontrado")).toBeInTheDocument();
		expect(screen.getByText("Ver todos os pacientes")).toBeInTheDocument();
	});

	it("renderiza profile card, score card e tabs quando o paciente é encontrado", () => {
		mockUsePatientProfile.mockReturnValue({
			data: { id: "p-1", name: "Maria Silva" },
			isLoading: false,
		});
		mockUsePatientAppointments.mockReturnValue({
			data: { content: [{ id: "a-1" }, { id: "a-2" }] },
			isLoading: false,
		});
		mockUseMedicalRecords.mockReturnValue({
			data: { allergies: "Nenhuma" },
			isLoading: false,
		});
		render(<PatientDetailContent id="p-1" />);
		expect(screen.getByText("profile-card:Maria Silva:2")).toBeInTheDocument();
		expect(screen.getByText("score-card")).toBeInTheDocument();
		expect(screen.getByText("tabs:info")).toBeInTheDocument();
	});

	it("usa a aba da query string como activeTab", () => {
		mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=consultas"));
		mockUsePatientProfile.mockReturnValue({
			data: { id: "p-1", name: "Maria Silva" },
			isLoading: false,
		});
		mockUsePatientAppointments.mockReturnValue({
			data: { content: [] },
			isLoading: false,
		});
		mockUseMedicalRecords.mockReturnValue({
			data: undefined,
			isLoading: false,
		});
		render(<PatientDetailContent id="p-1" />);
		expect(screen.getByText("tabs:consultas")).toBeInTheDocument();
	});

	it("usa 'info' como aba padrão quando o valor da query string é inválido", () => {
		mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=invalido"));
		mockUsePatientProfile.mockReturnValue({
			data: { id: "p-1", name: "Maria Silva" },
			isLoading: false,
		});
		mockUsePatientAppointments.mockReturnValue({
			data: { content: [] },
			isLoading: false,
		});
		mockUseMedicalRecords.mockReturnValue({
			data: undefined,
			isLoading: false,
		});
		render(<PatientDetailContent id="p-1" />);
		expect(screen.getByText("tabs:info")).toBeInTheDocument();
	});
});
