import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/professionals/professionals.api", () => ({
	professionalsListingApi: {
		getAll: vi.fn(),
		getById: vi.fn(),
		getNearby: vi.fn(),
		searchBySpecialty: vi.fn(),
	},
}));
vi.mock("@/lib/api/professionals/professional-applications.api", () => ({
	professionalApplicationsApi: {
		create: vi.fn(),
		approve: vi.fn(),
		reject: vi.fn(),
		getPendingApplications: vi.fn(),
		getApplicationStatus: vi.fn(),
	},
}));
vi.mock("@/lib/api/professionals/professional-profile.api", () => ({
	professionalProfileApi: {
		update: vi.fn(),
		delete: vi.fn(),
	},
}));
vi.mock("@/lib/api/professionals/my-professional-profile.api", () => ({
	getMyProfessionalProfileApi: vi.fn(),
}));

import { useApproveApplication } from "@/hooks/api/professionals/use-approve-application";
import { useSearchProfessionals } from "@/hooks/api/professionals/use-search-professionals";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";

const mockApprove = vi.mocked(professionalApplicationsApi.approve);
const mockSearchBySpecialty = vi.mocked(
	professionalsListingApi.searchBySpecialty,
);

const professional = {
	id: "prof-1",
	name: "Dr. Silva",
	specialty: "Cardiologia",
};

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useSearchProfessionals", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when specialty empty", () => {
		const { result } = renderHook(() => useSearchProfessionals(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when specialty provided", async () => {
		mockSearchBySpecialty.mockResolvedValueOnce([professional] as never);
		const { result } = renderHook(() => useSearchProfessionals("Cardiologia"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});

describe("useApproveApplication", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls approve with professionalId", async () => {
		mockApprove.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useApproveApplication(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("prof-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockApprove).toHaveBeenCalledWith("prof-1");
	});
});
