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
vi.mock("@/lib/api/clinics/clinics.api", () => ({
	clinicsCrudApi: { getMy: vi.fn() },
}));

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import { useMyClinic } from "./use-my-clinic";

const mockGetMy = vi.mocked(clinicsCrudApi.getMy);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMyClinic", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca as clínicas do profissional autenticado", async () => {
		const clinics = [{ id: "clinic-1", name: "Clínica Central" }];
		mockGetMy.mockResolvedValueOnce(clinics as never);
		const { result } = renderHook(() => useMyClinic(), { wrapper: wrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(clinics);
		expect(mockGetMy).toHaveBeenCalled();
	});
});
