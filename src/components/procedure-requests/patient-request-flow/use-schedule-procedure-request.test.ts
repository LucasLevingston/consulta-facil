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
import { useScheduleProcedureRequest } from "./use-schedule-procedure-request";

const mockSchedule = vi.mocked(procedureRequestsApi.schedule);

const procedureRequest = { id: "pr-1", status: "PENDING", type: "EXAM" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useScheduleProcedureRequest", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls schedule with requestId and data", async () => {
		mockSchedule.mockResolvedValueOnce(procedureRequest as never);
		const { result } = renderHook(() => useScheduleProcedureRequest(), {
			wrapper: wrapper(),
		});
		const data = { scheduledAt: "2026-06-10T10:00:00Z" };
		await act(async () => {
			result.current.mutate({ requestId: "pr-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSchedule).toHaveBeenCalledWith("pr-1", data);
	});
});
