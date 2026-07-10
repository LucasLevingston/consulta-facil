import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/professionals/professional-schedule.api", () => ({
	professionalScheduleApi: {
		getMySchedule: vi.fn(),
		getScheduleByProfessional: vi.fn(),
		saveMySchedule: vi.fn(),
	},
}));

import { professionalScheduleApi } from "@/lib/api/professionals/professional-schedule.api";
import { useSaveMySchedule } from "./use-save-my-schedule";

const mockSaveMySchedule = vi.mocked(professionalScheduleApi.saveMySchedule);

const schedule = [{ day: "MONDAY", startTime: "08:00", endTime: "17:00" }];

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useSaveMySchedule", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls saveMySchedule with items", async () => {
		mockSaveMySchedule.mockResolvedValueOnce(schedule as never);
		const { result } = renderHook(() => useSaveMySchedule(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(schedule as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSaveMySchedule).toHaveBeenCalledWith(schedule);
	});
});
