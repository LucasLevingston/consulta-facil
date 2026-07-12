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
import { useCheckInByQr } from "./use-check-in-by-qr";

const mockCheckInByQr = vi.mocked(appointmentCheckinApi.checkInByQr);

const appt = { id: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCheckInByQr", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls checkInByQr with token", async () => {
		mockCheckInByQr.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useCheckInByQr(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("qr-abc123");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCheckInByQr).toHaveBeenCalledWith("qr-abc123");
	});
});
