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
import { useRescheduleAppointment } from "./use-reschedule-appointment";

const mockReschedule = vi.mocked(appointmentsCrudApi.reschedule);

const appt = { id: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useRescheduleAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls reschedule with id and data", async () => {
		mockReschedule.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useRescheduleAppointment(), {
			wrapper: wrapper(),
		});
		const data = {
			scheduledAt: new Date("2026-07-01T10:00:00Z"),
			reason: "Reagendamento",
		};
		await act(async () => {
			result.current.mutate({ id: "a-1", data });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockReschedule).toHaveBeenCalledWith("a-1", data);
	});
});
