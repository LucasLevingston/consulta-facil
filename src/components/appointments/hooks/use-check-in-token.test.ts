import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
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
import { useCheckInToken } from "./use-check-in-token";

const mockGetCheckInToken = vi.mocked(appointmentCheckinApi.getCheckInToken);

const token = { token: "qr-abc123" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCheckInToken", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when appointmentId empty", () => {
		const { result } = renderHook(() => useCheckInToken(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches token when appointmentId provided", async () => {
		mockGetCheckInToken.mockResolvedValueOnce(token as never);
		const { result } = renderHook(() => useCheckInToken("a-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(token);
	});
});
