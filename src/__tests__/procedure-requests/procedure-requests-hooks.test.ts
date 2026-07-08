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

import { useCancelProcedureRequest } from "@/features/procedure-requests/hooks/use-cancel-procedure-request";
import { useCreateProcedureRequest } from "@/features/procedure-requests/hooks/use-create-procedure-request";
import { useGetMyProcedureRequests } from "@/features/procedure-requests/hooks/use-get-my-procedure-requests";
import { useScheduleProcedureRequest } from "@/features/procedure-requests/hooks/use-schedule-procedure-request";
import { procedureRequestsApi } from "@/lib/api/procedure-requests/procedure-requests.api";

const mockCreate = vi.mocked(procedureRequestsApi.create);
const mockGetMine = vi.mocked(procedureRequestsApi.getMine);
const mockCancel = vi.mocked(procedureRequestsApi.cancel);
const mockSchedule = vi.mocked(procedureRequestsApi.schedule);

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
