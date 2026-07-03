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

import { useDeleteProfessional } from "@/hooks/api/professionals/use-delete-professional";
import { useUpdateProfessional } from "@/hooks/api/professionals/use-update-professional";
import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";

const mockDelete = vi.mocked(professionalProfileApi.delete);
const mockUpdate = vi.mocked(professionalProfileApi.update);

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

describe("useDeleteProfessional", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls delete with professionalId", async () => {
		mockDelete.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteProfessional(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("prof-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDelete).toHaveBeenCalledWith("prof-1");
	});
});

describe("useUpdateProfessional", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls update with professionalId and data", async () => {
		mockUpdate.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useUpdateProfessional(), {
			wrapper: wrapper(),
		});
		const data = { name: "Dr. Silva Atualizado" };
		await act(async () => {
			result.current.mutate({ professionalId: "prof-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdate).toHaveBeenCalledWith("prof-1", data);
	});
});
