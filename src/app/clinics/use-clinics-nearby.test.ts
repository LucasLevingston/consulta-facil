import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/clinics/clinics.api", () => ({
	clinicsCrudApi: {
		getAll: vi.fn(),
		getMy: vi.fn(),
		getById: vi.fn(),
		getNearby: vi.fn(),
	},
}));

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import { useClinicsNearby } from "./use-clinics-nearby";

const mockGetNearby = vi.mocked(clinicsCrudApi.getNearby);

const clinic = { id: "c-1", name: "Clínica Saúde", city: "SP", state: "SP" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useClinicsNearby", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches nearby clinics with given coordinates", async () => {
		mockGetNearby.mockResolvedValueOnce([clinic] as never);
		const { result } = renderHook(() => useClinicsNearby(-23.5, -46.6, 50), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([clinic]);
	});

	it("fetches with zero coordinates when no location", async () => {
		mockGetNearby.mockResolvedValueOnce([] as never);
		const { result } = renderHook(() => useClinicsNearby(0, 0, 50), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([]);
	});
});
