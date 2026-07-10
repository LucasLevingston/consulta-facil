import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
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
import { useCancelProcedureRequest } from "./use-cancel-procedure-request";

const mockCancel = vi.mocked(procedureRequestsApi.cancel);

const procedureRequest = { id: "pr-1", status: "PENDING", type: "EXAM" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCancelProcedureRequest", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls cancel with id", async () => {
		mockCancel.mockResolvedValueOnce(procedureRequest as never);
		const { result } = renderHook(() => useCancelProcedureRequest(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("pr-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCancel).toHaveBeenCalledWith("pr-1");
	});
});
