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
import { useAddVaccine } from "./use-add-vaccine";

const mockAddVaccine = vi.mocked(patientVaccinesApi.addVaccine);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAddVaccine", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientVaccinesApi.addVaccine com os dados corretos", async () => {
		const vaccine = { name: "Gripe", applicationDate: "2026-01-01" };
		mockAddVaccine.mockResolvedValueOnce(vaccine as never);
		const { result } = renderHook(() => useAddVaccine(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(vaccine as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAddVaccine.mock.calls[0][0]).toEqual(vaccine);
	});
});
