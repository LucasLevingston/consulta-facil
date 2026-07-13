import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/clinics/use-clinics", () => ({
	useClinics: vi.fn(),
}));
vi.mock("@/app/clinics/use-clinics-nearby", () => ({
	useClinicsNearby: vi.fn(),
}));

import { useClinics } from "@/app/clinics/use-clinics";
import { useClinicsNearby } from "@/app/clinics/use-clinics-nearby";
import { useClinicsFilters } from "./use-clinics-filters";

const mockUseClinics = vi.mocked(useClinics);
const mockUseClinicsNearby = vi.mocked(useClinicsNearby);

const allClinics = [
	{
		id: "1",
		name: "Clinica Saude Central",
		state: "SP",
		city: "São Paulo",
		members: [{ specialty: "Cardiologia", role: "Medico" }],
	},
	{
		id: "2",
		name: "Clinica Bem Estar",
		state: "RJ",
		city: "Rio de Janeiro",
		members: [{ specialty: "Dermatologia", role: "Enfermeiro" }],
	},
];

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockUseClinics.mockReturnValue({
		data: allClinics,
		isLoading: false,
		error: null,
	} as never);
	mockUseClinicsNearby.mockReturnValue({
		data: [],
		isLoading: false,
		error: null,
	} as never);
	Object.defineProperty(global.navigator, "geolocation", {
		value: { getCurrentPosition: vi.fn() },
		configurable: true,
	});
});

describe("useClinicsFilters", () => {
	it("inicia com estado padrão de filtros", () => {
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		expect(result.current.filterState.search).toBe("");
		expect(result.current.filterState.filterState).toBe("");
		expect(result.current.filterState.filterCity).toBe("");
		expect(result.current.filterState.filterSpecialty).toBe("");
		expect(result.current.filterState.filterProfession).toBe("");
		expect(result.current.filterState.selectedDays).toEqual([]);
		expect(result.current.filterState.expanded).toBe(false);
		expect(result.current.filterState.viewMode).toBe("list");
		expect(result.current.derived.isNearbyMode).toBe(false);
	});

	it("atualiza o filtro de busca (search) e filtra pela lista exibida", () => {
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.setSearch("Bem Estar"));
		expect(result.current.filterState.search).toBe("Bem Estar");
		expect(result.current.displayed).toHaveLength(1);
		expect(result.current.displayed[0].name).toBe("Clinica Bem Estar");
	});

	it("filtra por estado (filterState)", () => {
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.setFilterState("SP"));
		expect(result.current.displayed).toHaveLength(1);
		expect(result.current.displayed[0].state).toBe("SP");
	});

	it("filtra por cidade (filterCity)", () => {
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.setFilterCity("Rio"));
		expect(result.current.displayed).toHaveLength(1);
		expect(result.current.displayed[0].city).toBe("Rio de Janeiro");
	});

	it("filtra por especialidade (filterSpecialty)", () => {
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.setFilterSpecialty("Cardiologia"));
		expect(result.current.displayed).toHaveLength(1);
		expect(result.current.displayed[0].name).toBe("Clinica Saude Central");
	});

	it("filtra por profissão (filterProfession)", () => {
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.setFilterProfession("Enfermeiro"));
		expect(result.current.displayed).toHaveLength(1);
		expect(result.current.displayed[0].name).toBe("Clinica Bem Estar");
	});

	it("atualiza selectedDays, expanded e viewMode", () => {
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		act(() => {
			result.current.actions.setSelectedDays(["MONDAY"] as never);
			result.current.actions.setExpanded(true);
			result.current.actions.setViewMode("map");
		});
		expect(result.current.filterState.selectedDays).toEqual(["MONDAY"]);
		expect(result.current.filterState.expanded).toBe(true);
		expect(result.current.filterState.viewMode).toBe("map");
	});

	it("clearFilters restaura todos os filtros para o estado inicial", () => {
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		act(() => {
			result.current.actions.setSearch("teste");
			result.current.actions.setFilterState("SP");
			result.current.actions.setFilterCity("SP Capital");
			result.current.actions.setFilterSpecialty("Cardiologia");
			result.current.actions.setFilterProfession("Medico");
			result.current.actions.setSelectedDays(["MONDAY"] as never);
		});
		act(() => result.current.actions.clearFilters());
		expect(result.current.filterState.search).toBe("");
		expect(result.current.filterState.filterState).toBe("");
		expect(result.current.filterState.filterCity).toBe("");
		expect(result.current.filterState.filterSpecialty).toBe("");
		expect(result.current.filterState.filterProfession).toBe("");
		expect(result.current.filterState.selectedDays).toEqual([]);
	});

	it("calcula options com estados, especialidades e profissões disponíveis", () => {
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		expect(result.current.options.availableStates).toEqual(["RJ", "SP"]);
		expect(result.current.options.availableSpecialties).toEqual([
			"Cardiologia",
			"Dermatologia",
		]);
		expect(result.current.options.availableProfessions).toEqual([
			"Enfermeiro",
			"Medico",
		]);
	});

	it("requestLocation ativa modo nearby e muda viewMode para map", () => {
		(
			global.navigator.geolocation.getCurrentPosition as ReturnType<
				typeof vi.fn
			>
		).mockImplementation((success: (pos: unknown) => void) => {
			success({ coords: { latitude: -23.5, longitude: -46.6 } });
		});
		const nearbyClinics = [allClinics[0]];
		mockUseClinicsNearby.mockReturnValue({
			data: nearbyClinics,
			isLoading: false,
			error: null,
		} as never);

		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.requestLocation());

		expect(result.current.location.userLocation).toEqual({
			lat: -23.5,
			lng: -46.6,
		});
		expect(result.current.derived.isNearbyMode).toBe(true);
		expect(result.current.filterState.viewMode).toBe("map");
		expect(result.current.displayed).toEqual(nearbyClinics);
	});

	it("clearLocation remove a localização do usuário", () => {
		(
			global.navigator.geolocation.getCurrentPosition as ReturnType<
				typeof vi.fn
			>
		).mockImplementation((success: (pos: unknown) => void) => {
			success({ coords: { latitude: -23.5, longitude: -46.6 } });
		});
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.requestLocation());
		expect(result.current.location.userLocation).not.toBeNull();
		act(() => result.current.actions.clearLocation());
		expect(result.current.location.userLocation).toBeNull();
		expect(result.current.derived.isNearbyMode).toBe(false);
	});

	it("propaga isLoading e error da query em uso conforme o modo", () => {
		mockUseClinics.mockReturnValue({
			data: allClinics,
			isLoading: true,
			error: new Error("falhou"),
		} as never);
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		expect(result.current.isLoading).toBe(true);
		expect(result.current.error).toEqual(new Error("falhou"));
	});

	it("setRadiusKm delega para o hook de localização", () => {
		const { result } = renderHook(() => useClinicsFilters(), {
			wrapper: wrapper(),
		});
		act(() => result.current.actions.setRadiusKm(20));
		expect(result.current.location.radiusKm).toBe(20);
	});
});
