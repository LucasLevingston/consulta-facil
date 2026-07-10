import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-vaccines.api", () => ({
	patientVaccinesApi: { listVaccines: vi.fn() },
}));

import { patientVaccinesApi } from "@/lib/api/patients/patient-vaccines.api";
import { useVaccines } from "./use-vaccines";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useVaccines", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches vaccines list", async () => {
		vi.mocked(patientVaccinesApi.listVaccines).mockResolvedValueOnce([
			{ id: "v-1", name: "BCG" },
		] as never);
		const { result } = renderHook(() => useVaccines(), { wrapper: wrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});
