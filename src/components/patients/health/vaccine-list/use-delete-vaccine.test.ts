import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-vaccines.api", () => ({
	patientVaccinesApi: {
		addVaccine: vi.fn(),
		deleteVaccine: vi.fn(),
	},
}));

import { patientVaccinesApi } from "@/lib/api/patients/patient-vaccines.api";
import { useDeleteVaccine } from "./use-delete-vaccine";

const mockDeleteVaccine = vi.mocked(patientVaccinesApi.deleteVaccine);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useDeleteVaccine", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientVaccinesApi.deleteVaccine com o id", async () => {
		mockDeleteVaccine.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteVaccine(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("v-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeleteVaccine.mock.calls[0][0]).toBe("v-1");
	});
});
