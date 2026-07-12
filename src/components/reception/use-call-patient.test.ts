import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointment-checkin.api", () => ({
	appointmentCheckinApi: {
		getCheckInToken: vi.fn(),
		checkInByQr: vi.fn(),
		getQueue: vi.fn(),
		callPatient: vi.fn(),
	},
}));

import { appointmentCheckinApi } from "@/lib/api/appointments/appointment-checkin.api";
import { useCallPatient } from "./use-call-patient";

const mockCallPatient = vi.mocked(appointmentCheckinApi.callPatient);

const appt = { id: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCallPatient", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls callPatient with appointmentId", async () => {
		mockCallPatient.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useCallPatient(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("a-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCallPatient).toHaveBeenCalledWith("a-1");
	});
});
