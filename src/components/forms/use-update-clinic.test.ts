import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
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
		create: vi.fn(),
		update: vi.fn(),
		addMember: vi.fn(),
		removeMember: vi.fn(),
	},
}));

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import { useUpdateClinic } from "./use-update-clinic";

const mockUpdate = vi.mocked(clinicsCrudApi.update);

const clinic = { id: "c-1", name: "Clínica Saúde", city: "SP" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUpdateClinic", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls update with id and data", async () => {
		mockUpdate.mockResolvedValueOnce(clinic as never);
		const { result } = renderHook(() => useUpdateClinic(), {
			wrapper: wrapper(),
		});
		const data = { name: "Clínica Atualizada" };
		await act(async () => {
			result.current.mutate({ id: "c-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdate).toHaveBeenCalledWith("c-1", data);
	});
});
