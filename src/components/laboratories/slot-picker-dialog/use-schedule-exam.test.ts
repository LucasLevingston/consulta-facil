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
import { useScheduleExam } from "./use-schedule-exam";

const mockScheduleExam = vi.mocked(examLabApi.scheduleExam);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useScheduleExam", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama examLabApi.scheduleExam com os dados corretos", async () => {
		const data = {
			examRequestId: "req-1",
			examLabId: "lab-1",
			scheduledDate: "2026-01-10",
			scheduledTime: "10:00",
		};
		const scheduling = { id: "sched-1", ...data };
		mockScheduleExam.mockResolvedValueOnce(scheduling as never);
		const { result } = renderHook(() => useScheduleExam(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockScheduleExam.mock.calls[0][0]).toEqual(data);
	});
});
