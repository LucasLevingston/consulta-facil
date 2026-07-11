import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLabLocation } from "@/app/laboratories/use-lab-location";
import { useClinicsLocation } from "@/features/clinics/hooks/use-clinics-location";

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

describe("useClinicsLocation", () => {
	it("inicia com userLocation nulo, locationLoading falso e radiusKm padrão 50", () => {
		const { result } = renderHook(() => useClinicsLocation());
		expect(result.current.userLocation).toBeNull();
		expect(result.current.locationLoading).toBe(false);
		expect(result.current.radiusKm).toBe(50);
	});

	it("requestLocation define userLocation em caso de sucesso e chama onSuccess", () => {
		mockGeolocation("success", -23.5, -46.6);
		const onSuccess = vi.fn();
		const { result } = renderHook(() => useClinicsLocation());
		act(() => result.current.requestLocation(onSuccess));
		expect(result.current.userLocation).toEqual({ lat: -23.5, lng: -46.6 });
		expect(result.current.locationLoading).toBe(false);
		expect(onSuccess).toHaveBeenCalledTimes(1);
	});

	it("requestLocation mantém userLocation nulo quando a permissão é negada", () => {
		mockGeolocation("error");
		const { result } = renderHook(() => useClinicsLocation());
		act(() => result.current.requestLocation());
		expect(result.current.userLocation).toBeNull();
		expect(result.current.locationLoading).toBe(false);
	});

	it("requestLocation não faz nada quando geolocation não está disponível", () => {
		mockGeolocation("unavailable");
		const { result } = renderHook(() => useClinicsLocation());
		act(() => result.current.requestLocation());
		expect(result.current.userLocation).toBeNull();
		expect(result.current.locationLoading).toBe(false);
	});

	it("setRadiusKm atualiza o raio de busca", () => {
		const { result } = renderHook(() => useClinicsLocation());
		act(() => result.current.setRadiusKm(100));
		expect(result.current.radiusKm).toBe(100);
	});

	it("clearLocation remove a localização do usuário", () => {
		mockGeolocation("success", -23.5, -46.6);
		const { result } = renderHook(() => useClinicsLocation());
		act(() => result.current.requestLocation());
		expect(result.current.userLocation).not.toBeNull();
		act(() => result.current.clearLocation());
		expect(result.current.userLocation).toBeNull();
	});
});

describe("useLabLocation", () => {
	it("inicia com userLocation nulo, locationLoading falso e radiusKm padrão 50", () => {
		const { result } = renderHook(() => useLabLocation());
		expect(result.current.userLocation).toBeNull();
		expect(result.current.locationLoading).toBe(false);
		expect(result.current.radiusKm).toBe(50);
	});

	it("requestLocation define userLocation em caso de sucesso", () => {
		mockGeolocation("success", -22.9, -43.2);
		const { result } = renderHook(() => useLabLocation());
		act(() => result.current.requestLocation());
		expect(result.current.userLocation).toEqual({ lat: -22.9, lng: -43.2 });
		expect(result.current.locationLoading).toBe(false);
	});

	it("requestLocation mantém userLocation nulo quando a permissão é negada", () => {
		mockGeolocation("error");
		const { result } = renderHook(() => useLabLocation());
		act(() => result.current.requestLocation());
		expect(result.current.userLocation).toBeNull();
		expect(result.current.locationLoading).toBe(false);
	});

	it("requestLocation não faz nada quando geolocation não está disponível", () => {
		mockGeolocation("unavailable");
		const { result } = renderHook(() => useLabLocation());
		act(() => result.current.requestLocation());
		expect(result.current.userLocation).toBeNull();
	});

	it("setRadiusKm atualiza o raio de busca", () => {
		const { result } = renderHook(() => useLabLocation());
		act(() => result.current.setRadiusKm(30));
		expect(result.current.radiusKm).toBe(30);
	});

	it("clearLocation remove a localização do usuário", () => {
		mockGeolocation("success", -22.9, -43.2);
		const { result } = renderHook(() => useLabLocation());
		act(() => result.current.requestLocation());
		act(() => result.current.clearLocation());
		expect(result.current.userLocation).toBeNull();
	});
});
