import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointments.api", () => ({
	appointmentsCrudApi: {
		schedule: vi.fn(),
		reschedule: vi.fn(),
		delete: vi.fn(),
	},
}));

import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import { useScheduleAppointment } from "./use-schedule-appointment";

const mockSchedule = vi.mocked(appointmentsCrudApi.schedule);

const appt = { id: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useScheduleAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls schedule with data", async () => {
		mockSchedule.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useScheduleAppointment(), {
			wrapper: wrapper(),
		});
		const data = {
			professionalId: "prof-1",
			scheduledAt: "2026-07-01T10:00:00Z",
		};
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSchedule).toHaveBeenCalledWith(data);
	});
});
