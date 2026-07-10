import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-profile.api", () => ({
	patientProfileApi: { getAll: vi.fn() },
}));

import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";
import { useAllAdminPatients } from "./use-all-admin-patients";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAllAdminPatients", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches all admin patients", async () => {
		vi.mocked(patientProfileApi.getAll).mockResolvedValueOnce([] as never);
		const { result } = renderHook(() => useAllAdminPatients({}), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([]);
	});
});
