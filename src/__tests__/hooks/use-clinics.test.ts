import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/clinics.api", () => ({
	clinicsApi: {
		getAll: vi.fn(),
		getMy: vi.fn(),
		getById: vi.fn(),
		getNearby: vi.fn(),
	},
}));

import { useClinicById } from "@/hooks/api/clinics/use-clinic-by-id";
import { useClinics } from "@/hooks/api/clinics/use-clinics";
import { useClinicsNearby } from "@/hooks/api/clinics/use-clinics-nearby";
import { useMyClinic } from "@/hooks/api/clinics/use-my-clinic";
import { clinicsApi } from "@/lib/api/clinics.api";

const mockGetAll = vi.mocked(clinicsApi.getAll);
const mockGetById = vi.mocked(clinicsApi.getById);
const mockGetNearby = vi.mocked(clinicsApi.getNearby);

const clinic = { id: "c-1", name: "Clínica Saúde", city: "SP", state: "SP" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useClinics", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches clinics list", async () => {
		mockGetAll.mockResolvedValueOnce([clinic] as never);
		const { result } = renderHook(() => useClinics(), { wrapper: wrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});

	it("sets isLoading initially", () => {
		mockGetAll.mockResolvedValueOnce([] as never);
		const { result } = renderHook(() => useClinics(), { wrapper: wrapper() });
		expect(result.current.isLoading).toBe(true);
	});
});

describe("useClinicById", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when id is empty", () => {
		const { result } = renderHook(() => useClinicById(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when id provided", async () => {
		mockGetById.mockResolvedValueOnce(clinic as never);
		const { result } = renderHook(() => useClinicById("c-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
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
