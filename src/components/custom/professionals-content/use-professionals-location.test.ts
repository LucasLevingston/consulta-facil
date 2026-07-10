import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProfessionalsLocation } from "./use-professionals-location";

function mockGeolocation(
	kind: "success" | "error" | "unavailable",
	lat = 0,
	lng = 0,
) {
	if (kind === "unavailable") {
		Object.defineProperty(global.navigator, "geolocation", {
			value: undefined,
			configurable: true,
		});
		return;
	}
	Object.defineProperty(global.navigator, "geolocation", {
		value: {
			getCurrentPosition: vi.fn(
				(success: (pos: unknown) => void, error: (err: unknown) => void) => {
					if (kind === "success") {
						success({ coords: { latitude: lat, longitude: lng } });
					} else {
						error({ code: 1, message: "Permissão negada" });
					}
				},
			),
		},
		configurable: true,
	});
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe("useProfessionalsLocation", () => {
	it("inicia com viewMode 'list', userLocation nulo e radiusKm padrão 50", () => {
		const { result } = renderHook(() => useProfessionalsLocation());
		expect(result.current.viewMode).toBe("list");
		expect(result.current.userLocation).toBeNull();
		expect(result.current.locationLoading).toBe(false);
		expect(result.current.radiusKm).toBe(50);
	});

	it("requestLocation define userLocation e muda viewMode para 'map' em caso de sucesso", () => {
		mockGeolocation("success", -19.9, -43.9);
		const { result } = renderHook(() => useProfessionalsLocation());
		act(() => result.current.requestLocation());
		expect(result.current.userLocation).toEqual({ lat: -19.9, lng: -43.9 });
		expect(result.current.viewMode).toBe("map");
		expect(result.current.locationLoading).toBe(false);
	});

	it("requestLocation mantém viewMode 'list' quando a permissão é negada", () => {
		mockGeolocation("error");
		const { result } = renderHook(() => useProfessionalsLocation());
		act(() => result.current.requestLocation());
		expect(result.current.userLocation).toBeNull();
		expect(result.current.viewMode).toBe("list");
		expect(result.current.locationLoading).toBe(false);
	});

	it("requestLocation não faz nada quando geolocation não está disponível", () => {
		mockGeolocation("unavailable");
		const { result } = renderHook(() => useProfessionalsLocation());
		act(() => result.current.requestLocation());
		expect(result.current.userLocation).toBeNull();
		expect(result.current.viewMode).toBe("list");
	});

	it("setViewMode permite alternar manualmente entre 'list' e 'map'", () => {
		const { result } = renderHook(() => useProfessionalsLocation());
		act(() => result.current.setViewMode("map"));
		expect(result.current.viewMode).toBe("map");
	});

	it("setRadiusKm atualiza o raio de busca", () => {
		const { result } = renderHook(() => useProfessionalsLocation());
		act(() => result.current.setRadiusKm(75));
		expect(result.current.radiusKm).toBe(75);
	});

	it("clearLocation remove a localização do usuário", () => {
		mockGeolocation("success", -19.9, -43.9);
		const { result } = renderHook(() => useProfessionalsLocation());
		act(() => result.current.requestLocation());
		act(() => result.current.clearLocation());
		expect(result.current.userLocation).toBeNull();
	});
});
