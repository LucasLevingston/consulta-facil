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

import { useClinicById } from "@/hooks/api/clinics/use-clinic-by-id";
import { useClinics } from "@/hooks/api/clinics/use-clinics";
import { useClinicsNearby } from "@/hooks/api/clinics/use-clinics-nearby";
import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";

const mockGetAll = vi.mocked(clinicsCrudApi.getAll);
const mockGetById = vi.mocked(clinicsCrudApi.getById);
const mockGetNearby = vi.mocked(clinicsCrudApi.getNearby);

const clinic = { id: "c-1", name: "Clínica Saúde", city: "SP", state: "SP" };

function wrapper(useSuspense = false) {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			useSuspense
				? createElement(Suspense, { fallback: null }, children)
				: children,
		);
}

describe("useClinics", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches clinics list", async () => {
		mockGetAll.mockResolvedValueOnce([clinic] as never);
		const { result } = renderHook(() => useClinics(), {
			wrapper: wrapper(true),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toHaveLength(1);
	});
});

describe("useClinicById", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches when id provided", async () => {
		mockGetById.mockResolvedValueOnce(clinic as never);
		const { result } = renderHook(() => useClinicById("c-1"), {
			wrapper: wrapper(true),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual(clinic);
	});
});

describe("useClinicsNearby", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when lat/lng null", () => {
		const { result } = renderHook(() => useClinicsNearby(null, null, 50), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("enabled when lat/lng provided", async () => {
		mockGetNearby.mockResolvedValueOnce([clinic] as never);
		const { result } = renderHook(() => useClinicsNearby(-23.5, -46.6, 50), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});
