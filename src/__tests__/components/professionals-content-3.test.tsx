import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(() => ({ replace: vi.fn() })),
	useSearchParams: vi.fn(() => new URLSearchParams()),
}));
vi.mock("@/features/professionals/hooks/use-professionals", () => ({
	useProfessionals: vi.fn(),
}));
vi.mock("@/features/professionals/hooks/use-professionals-nearby", () => ({
	useProfessionalsNearby: vi.fn(),
}));
vi.mock("@/components/custom/professional/ProfessionalFilters", () => ({
	default: () => <div data-testid="professional-filters" />,
}));
vi.mock("@/components/custom/professional/ProfessionalsList", () => ({
	default: ({ professionals }: { professionals: unknown[] }) => (
		<div data-testid="professionals-list">
			{professionals.length} profissionais
		</div>
	),
}));
vi.mock("@/components/custom/map/ProfessionalsMap", () => ({
	ProfessionalsMap: () => <div data-testid="professionals-map" />,
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
import { useProfessionals } from "@/features/professionals/hooks/use-professionals";
import { useProfessionalsNearby } from "@/features/professionals/hooks/use-professionals-nearby";

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

describe("ProfessionalsContent — loading and error", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupMocks();
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
