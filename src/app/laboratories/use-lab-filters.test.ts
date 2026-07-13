import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/laboratories/use-exam-labs", () => ({
	useExamLabs: vi.fn(),
}));
vi.mock("@/app/laboratories/use-exam-labs-nearby", () => ({
	useExamLabsNearby: vi.fn(),
}));

import { useExamLabs } from "@/app/laboratories/use-exam-labs";
import { useExamLabsNearby } from "@/app/laboratories/use-exam-labs-nearby";
import { useLabFilters } from "./use-lab-filters";

const mockUseExamLabs = vi.mocked(useExamLabs);
const mockUseExamLabsNearby = vi.mocked(useExamLabsNearby);

const allLabs = [
	{
		id: "1",
		name: "Lab Diagnostico",
		state: "SP",
		city: "São Paulo",
		acceptedExams: ["Hemograma"],
	},
	{
		id: "2",
		name: "Lab Analises",
		state: "RJ",
		city: "Rio de Janeiro",
		acceptedExams: ["Glicemia"],
	},
];

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockUseExamLabs.mockReturnValue({
		data: allLabs,
		isLoading: false,
		error: null,
	} as never);
	mockUseExamLabsNearby.mockReturnValue({
		data: [],
		isLoading: false,
		error: null,
	} as never);
	Object.defineProperty(global.navigator, "geolocation", {
		value: { getCurrentPosition: vi.fn() },
		configurable: true,
	});
});

describe("useLabFilters", () => {
	it("inicia com estado padrão de filtros", () => {
		const { result } = renderHook(() => useLabFilters(), {
			wrapper: wrapper(),
		});
		expect(result.current.filterState.search).toBe("");
		expect(result.current.filterState.filterState).toBe("");
		expect(result.current.filterState.filterCity).toBe("");
		expect(result.current.filterState.expanded).toBe(false);
		expect(result.current.derived.isNearbyMode).toBe(false);
	});

	it("atualiza a busca e filtra pelo nome ou exame aceito", () => {
		const { result } = renderHook(() => useLabFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.setSearch("Glicemia"));
		expect(result.current.displayed).toHaveLength(1);
		expect(result.current.displayed[0].name).toBe("Lab Analises");
	});

	it("filtra por estado", () => {
		const { result } = renderHook(() => useLabFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.setFilterState("SP"));
		expect(result.current.displayed).toHaveLength(1);
		expect(result.current.displayed[0].state).toBe("SP");
	});

	it("filtra por cidade", () => {
		const { result } = renderHook(() => useLabFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.setFilterCity("Rio"));
		expect(result.current.displayed).toHaveLength(1);
		expect(result.current.displayed[0].city).toBe("Rio de Janeiro");
	});

	it("clearFilters restaura os filtros", () => {
		const { result } = renderHook(() => useLabFilters(), {
			wrapper: wrapper(),
		});
		act(() => {
			result.current.actions.setSearch("x");
			result.current.actions.setFilterState("SP");
			result.current.actions.setFilterCity("y");
		});
		act(() => result.current.actions.clearFilters());
		expect(result.current.filterState.search).toBe("");
		expect(result.current.filterState.filterState).toBe("");
		expect(result.current.filterState.filterCity).toBe("");
	});

	it("calcula availableStates a partir dos labs", () => {
		const { result } = renderHook(() => useLabFilters(), {
			wrapper: wrapper(),
		});
		expect(result.current.options.availableStates).toEqual(["RJ", "SP"]);
	});

	it("ativa modo nearby via requestLocation", () => {
		(
			global.navigator.geolocation.getCurrentPosition as ReturnType<
				typeof vi.fn
			>
		).mockImplementation((success: (pos: unknown) => void) => {
			success({ coords: { latitude: -22.9, longitude: -43.2 } });
		});
		const nearbyLabs = [allLabs[1]];
		mockUseExamLabsNearby.mockReturnValue({
			data: nearbyLabs,
			isLoading: false,
			error: null,
		} as never);

		const { result } = renderHook(() => useLabFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.requestLocation());

		expect(result.current.location.userLocation).toEqual({
			lat: -22.9,
			lng: -43.2,
		});
		expect(result.current.derived.isNearbyMode).toBe(true);
		expect(result.current.displayed).toEqual(nearbyLabs);
	});

	it("propaga isLoading e error da query em uso", () => {
		mockUseExamLabs.mockReturnValue({
			data: allLabs,
			isLoading: false,
			error: new Error("erro labs"),
		} as never);
		const { result } = renderHook(() => useLabFilters(), {
			wrapper: wrapper(),
		});
		expect(result.current.error).toEqual(new Error("erro labs"));
	});
});
