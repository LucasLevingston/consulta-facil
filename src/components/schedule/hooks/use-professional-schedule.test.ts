import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
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
import { useProfessionalSchedule } from "./use-professional-schedule";

const mockGetByProfessional = vi.mocked(
	professionalScheduleApi.getScheduleByProfessional,
);

const schedule = [{ day: "MONDAY", startTime: "08:00", endTime: "17:00" }];

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useProfessionalSchedule", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when professionalId empty", () => {
		const { result } = renderHook(() => useProfessionalSchedule(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when professionalId provided", async () => {
		mockGetByProfessional.mockResolvedValueOnce(schedule as never);
		const { result } = renderHook(() => useProfessionalSchedule("prof-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(schedule);
	});
});
