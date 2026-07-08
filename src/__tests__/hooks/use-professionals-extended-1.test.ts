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

import { useProfessionals } from "@/features/professionals/hooks/use-professionals";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";

const mockGetAll = vi.mocked(professionalsListingApi.getAll);
const professional = { id: "d-1", name: "Dra. Ana", specialty: "Cardiologia" };
const page = {
	content: [professional],
	totalElements: 1,
	totalPages: 1,
	number: 0,
};

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
