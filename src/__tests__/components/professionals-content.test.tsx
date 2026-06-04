import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(() => ({ replace: vi.fn() })),
	useSearchParams: vi.fn(() => new URLSearchParams()),
}));
vi.mock("@/hooks/api/doctors/use-professionals", () => ({
	useProfessionals: vi.fn(),
}));
vi.mock("@/hooks/api/doctors/use-professionals-nearby", () => ({
	useProfessionalsNearby: vi.fn(),
}));
vi.mock("@/components/custom/doctor/DoctorFilters", () => ({
	default: () => <div data-testid="doctor-filters" />,
}));
vi.mock("@/components/custom/doctor/DoctorsClientList", () => ({
	default: ({ doctors }: { doctors: unknown[] }) => (
		<div data-testid="doctors-list">{doctors.length} doutores</div>
	),
}));
vi.mock("@/components/custom/map/DoctorsMap", () => ({
	DoctorsMap: () => <div data-testid="doctors-map" />,
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
vi.mock("@/components/custom/custom-pagination", () => ({
	CustomPagination: () => <div data-testid="pagination" />,
}));
vi.mock("@/components/custom/page-header", () => ({
	default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

import ProfessionalsContent from "@/components/custom/ProfessionalsContent";
import { useProfessionals } from "@/hooks/api/doctors/use-professionals";
import { useProfessionalsNearby } from "@/hooks/api/doctors/use-professionals-nearby";

const mockUseProfessionals = vi.mocked(useProfessionals);
const mockUseProfessionalsNearby = vi.mocked(useProfessionalsNearby);

const emptyPage = {
	data: { content: [], totalPages: 1, totalElements: 0 },
	isLoading: false,
	error: null,
};

function setupMocks() {
	mockUseProfessionals.mockReturnValue(emptyPage as never);
	mockUseProfessionalsNearby.mockReturnValue({
		data: [],
		isLoading: false,
		error: null,
	} as never);
}

describe("ProfessionalsContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupMocks();
	});

	it("renders page header", () => {
		render(<ProfessionalsContent />);
		expect(screen.getByText("Profissionais")).toBeInTheDocument();
	});

	it("renders DoctorFilters", () => {
		render(<ProfessionalsContent />);
		expect(screen.getByTestId("doctor-filters")).toBeInTheDocument();
	});

	it("shows list view by default", () => {
		render(<ProfessionalsContent />);
		expect(screen.getByTestId("doctors-list")).toBeInTheDocument();
	});

	it("shows pagination in list mode", () => {
		render(<ProfessionalsContent />);
		expect(screen.getByTestId("pagination")).toBeInTheDocument();
	});

	it("shows 'Perto de mim' button when no location", () => {
		render(<ProfessionalsContent />);
		expect(screen.getByText("Perto de mim")).toBeInTheDocument();
	});

	it("switches to map view when map button clicked", async () => {
		render(<ProfessionalsContent />);
		const buttons = screen.getAllByRole("button");
		const _mapBtn = buttons.find((b) => b.querySelector("svg"));
		const viewButtons = screen
			.getAllByRole("button")
			.filter((b) => b.className.includes("rounded-none"));
		await userEvent.click(viewButtons[1]);
		expect(screen.getByTestId("doctors-map")).toBeInTheDocument();
	});

	it("shows loading state", () => {
		mockUseProfessionals.mockReturnValue({
			data: null,
			isLoading: true,
			error: null,
		} as never);
		render(<ProfessionalsContent />);
		expect(screen.getByTestId("loading")).toBeInTheDocument();
	});

	it("shows error state", () => {
		mockUseProfessionals.mockReturnValue({
			data: null,
			isLoading: false,
			error: new Error("fail"),
		} as never);
		render(<ProfessionalsContent />);
		expect(screen.getByTestId("error")).toBeInTheDocument();
	});
});
