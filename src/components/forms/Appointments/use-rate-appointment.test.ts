import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointment-ratings.api", () => ({
	appointmentRatingsApi: { rate: vi.fn() },
}));

import { appointmentRatingsApi } from "@/lib/api/appointments/appointment-ratings.api";
import { useRateAppointment } from "./use-rate-appointment";

const mockRate = vi.mocked(appointmentRatingsApi.rate);

const appt = { id: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useRateAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls rate with id and data", async () => {
		mockRate.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useRateAppointment(), {
			wrapper: wrapper(),
		});
		const data = { rating: 5, comment: "Ótimo!" };
		await act(async () => {
			result.current.mutate({ id: "a-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockRate).toHaveBeenCalledWith("a-1", data);
	});
});
