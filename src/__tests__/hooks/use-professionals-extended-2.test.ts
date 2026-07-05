import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		defaults: { headers: { common: {} } },
	},
}));
vi.mock("@/lib/api/professionals/professionals.api", () => ({
	professionalsListingApi: {
		getAll: vi.fn(),
		getById: vi.fn(),
		getNearby: vi.fn(),
	},
}));
vi.mock("@/lib/api/professionals/professional-applications.api", () => ({
	professionalApplicationsApi: {
		getPendingApplications: vi.fn(),
		getApplicationStatus: vi.fn(),
	},
}));

import { useApplicationStatus } from "@/hooks/api/professionals/use-application-status";
import { useProfessional } from "@/hooks/api/professionals/use-professional";
import { useProfessionalsNearby } from "@/hooks/api/professionals/use-professionals-nearby";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";

const mockGetById = vi.mocked(professionalsListingApi.getById);
const mockGetNearby = vi.mocked(professionalsListingApi.getNearby);
const mockAppStatus = vi.mocked(
	professionalApplicationsApi.getApplicationStatus,
);
const professional = { id: "d-1", name: "Dra. Ana", specialty: "Cardiologia" };

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

describe("useProfessional", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches when id provided", async () => {
		mockGetById.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useProfessional("d-1"), {
			wrapper: wrapper(true),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data.id).toBe("d-1");
	});
});

describe("useProfessionalsNearby", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when lat/lng null", () => {
		const { result } = renderHook(() => useProfessionalsNearby(null, null), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("enabled with lat/lng", async () => {
		mockGetNearby.mockResolvedValueOnce([professional] as never);
		const { result } = renderHook(() => useProfessionalsNearby(-23.5, -46.6), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});

describe("useApplicationStatus", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches application status", async () => {
		mockAppStatus.mockResolvedValueOnce({
			id: "p-1",
			status: "PENDING",
		} as never);
		const { result } = renderHook(() => useApplicationStatus(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});
