import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointment-payment.api", () => ({
	appointmentPaymentApi: { createPayment: vi.fn() },
}));

import { appointmentPaymentApi } from "@/lib/api/appointments/appointment-payment.api";
import { useCreatePayment } from "./use-create-payment";

const mockCreatePayment = vi.mocked(appointmentPaymentApi.createPayment);

const payment = { id: "pay-1", checkoutUrl: "https://pay.example.com" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCreatePayment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls createPayment with appointmentId", async () => {
		mockCreatePayment.mockResolvedValueOnce(payment as never);
		const { result } = renderHook(() => useCreatePayment(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({ appointmentId: "a-1" });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCreatePayment).toHaveBeenCalledWith("a-1", undefined);
	});
});
