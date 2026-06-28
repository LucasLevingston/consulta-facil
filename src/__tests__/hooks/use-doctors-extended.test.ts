import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
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

import { useApplicationStatus } from "@/hooks/api/doctors/use-application-status";
import { useProfessional } from "@/hooks/api/doctors/use-professional";
import { useProfessionals } from "@/hooks/api/doctors/use-professionals";
import { useProfessionalsNearby } from "@/hooks/api/doctors/use-professionals-nearby";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";

const mockGetAll = vi.mocked(professionalsListingApi.getAll);
const mockGetById = vi.mocked(professionalsListingApi.getById);
const mockGetNearby = vi.mocked(professionalsListingApi.getNearby);
const mockAppStatus = vi.mocked(
	professionalApplicationsApi.getApplicationStatus,
);

const doctor = { id: "d-1", name: "Dra. Ana", specialty: "Cardiologia" };
const page = { content: [doctor], totalElements: 1, totalPages: 1, number: 0 };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useProfessionals", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches list with default params", async () => {
		mockGetAll.mockResolvedValueOnce(page as never);
		const { result } = renderHook(() => useProfessionals(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data?.content).toHaveLength(1);
	});

	it("passes serviceTitle to api", async () => {
		mockGetAll.mockResolvedValueOnce(page as never);
		const { result } = renderHook(
			() => useProfessionals(0, 12, undefined, undefined, undefined, "ECG"),
			{ wrapper: wrapper() },
		);
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGetAll).toHaveBeenCalledWith(
			0,
			12,
			undefined,
			undefined,
			undefined,
			"ECG",
		);
	});

	it("passes specialty filter to api", async () => {
		mockGetAll.mockResolvedValueOnce(page as never);
		const { result } = renderHook(
			() => useProfessionals(0, 12, undefined, "Cardiologia"),
			{ wrapper: wrapper() },
		);
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGetAll).toHaveBeenCalledWith(
			0,
			12,
			undefined,
			"Cardiologia",
			undefined,
			undefined,
		);
	});
});

describe("useProfessional", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when id empty", () => {
		const { result } = renderHook(() => useProfessional(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when id provided", async () => {
		mockGetById.mockResolvedValueOnce(doctor as never);
		const { result } = renderHook(() => useProfessional("d-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data?.id).toBe("d-1");
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
		mockGetNearby.mockResolvedValueOnce([doctor] as never);
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
