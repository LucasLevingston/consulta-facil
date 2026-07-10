import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/procedure-requests/procedure-requests.api", () => ({
	procedureRequestsApi: {
		create: vi.fn(),
		getMine: vi.fn(),
		cancel: vi.fn(),
		schedule: vi.fn(),
	},
}));

import { procedureRequestsApi } from "@/lib/api/procedure-requests/procedure-requests.api";
import { useGetMyProcedureRequests } from "./use-get-my-procedure-requests";

const mockGetMine = vi.mocked(procedureRequestsApi.getMine);

const procedureRequest = { id: "pr-1", status: "PENDING", type: "EXAM" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useGetMyProcedureRequests", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches my procedure requests", async () => {
		mockGetMine.mockResolvedValueOnce([procedureRequest] as never);
		const { result } = renderHook(() => useGetMyProcedureRequests(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});
