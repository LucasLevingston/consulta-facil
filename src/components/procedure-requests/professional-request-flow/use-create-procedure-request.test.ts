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
import { useCreateProcedureRequest } from "./use-create-procedure-request";

const mockCreate = vi.mocked(procedureRequestsApi.create);

const procedureRequest = { id: "pr-1", status: "PENDING", type: "EXAM" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCreateProcedureRequest", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls create with data", async () => {
		mockCreate.mockResolvedValueOnce(procedureRequest as never);
		const { result } = renderHook(() => useCreateProcedureRequest(), {
			wrapper: wrapper(),
		});
		const data = { type: "EXAM", description: "Raio-X" };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCreate).toHaveBeenCalledWith(data);
	});
});
