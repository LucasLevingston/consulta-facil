import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/clinics", () => ({
	useMyClinic: vi.fn(),
}));
vi.mock("@/providers/query-boundary", () => ({
	QueryBoundary: ({
		children,
		isLoading,
		error,
	}: {
		children: React.ReactNode;
		isLoading: boolean;
		error: unknown;
	}) =>
		isLoading ? (
			<div data-testid="loading" />
		) : error ? (
			<div data-testid="error">Erro ao carregar dados</div>
		) : (
			<div>{children}</div>
		),
}));
vi.mock("@/components/forms/ClinicForm", () => ({
	ClinicForm: ({ clinic }: { clinic?: { id: string } }) => (
		<div>ClinicForm:{clinic?.id ?? "novo"}</div>
	),
}));
vi.mock("@/components/custom/clinic/ClinicWorkingHoursSection", () => ({
	ClinicWorkingHoursSection: ({ clinicId }: { clinicId: string }) => (
		<div>ClinicWorkingHoursSection:{clinicId}</div>
	),
}));
vi.mock("@/components/custom/clinic/ReceptionistsSection", () => ({
	ReceptionistsSection: ({ clinicId }: { clinicId: string }) => (
		<div>ReceptionistsSection:{clinicId}</div>
	),
}));

import { MyClinicContent } from "@/components/custom/clinic/MyClinicContent";
import { useMyClinic } from "@/features/clinics";

const mockUseMyClinic = vi.mocked(useMyClinic);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("MyClinicContent", () => {
	it("mostra o estado de carregamento", () => {
		mockUseMyClinic.mockReturnValue({
			data: undefined,
			isLoading: true,
			error: null,
		} as never);
		render(<MyClinicContent />);
		expect(screen.getByTestId("loading")).toBeInTheDocument();
	});

	it("mostra erro ao carregar quando a query falha", () => {
		mockUseMyClinic.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: new Error("falhou"),
		} as never);
		render(<MyClinicContent />);
		expect(screen.getByTestId("error")).toHaveTextContent(
			"Erro ao carregar dados",
		);
	});

	it("renderiza apenas o ClinicForm quando o usuário ainda não tem clínica", () => {
		mockUseMyClinic.mockReturnValue({
			data: [],
			isLoading: false,
			error: null,
		} as never);
		render(<MyClinicContent />);
		expect(screen.getByText("ClinicForm:novo")).toBeInTheDocument();
		expect(
			screen.queryByText(/ClinicWorkingHoursSection:/),
		).not.toBeInTheDocument();
		expect(screen.queryByText(/ReceptionistsSection:/)).not.toBeInTheDocument();
	});

	it("renderiza o form e as seções de horários e recepcionistas quando já existe clínica", () => {
		mockUseMyClinic.mockReturnValue({
			data: [{ id: "c-1" }],
			isLoading: false,
			error: null,
		} as never);
		render(<MyClinicContent />);
		expect(screen.getByText("ClinicForm:c-1")).toBeInTheDocument();
		expect(
			screen.getByText("ClinicWorkingHoursSection:c-1"),
		).toBeInTheDocument();
		expect(screen.getByText("ReceptionistsSection:c-1")).toBeInTheDocument();
	});
});
