import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));
vi.mock("@/lib/api/exam-labs/exam-labs.api", () => ({
	examLabApi: {
		scheduleExam: vi.fn(),
		cancelScheduling: vi.fn(),
	},
}));

import { examLabApi } from "@/lib/api/exam-labs/exam-labs.api";
import { useCancelExamScheduling } from "./use-cancel-exam-scheduling";

const mockCancelScheduling = vi.mocked(examLabApi.cancelScheduling);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCancelExamScheduling", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama examLabApi.cancelScheduling com o id do agendamento", async () => {
		mockCancelScheduling.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useCancelExamScheduling(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("sched-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCancelScheduling).toHaveBeenCalledWith("sched-1");
	});
});
