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
import { useQueue } from "./use-queue";

const mockGetQueue = vi.mocked(appointmentCheckinApi.getQueue);

const appt = { id: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useQueue", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches queue", async () => {
		mockGetQueue.mockResolvedValueOnce([appt] as never);
		const { result } = renderHook(() => useQueue(), { wrapper: wrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});
