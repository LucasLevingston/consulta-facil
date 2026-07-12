import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-payment.repository", () => ({
	billingPaymentRepository: {
		refundPayment: vi.fn().mockResolvedValue(null),
	},
}));

import { useRefundBillingPayment } from "./use-refund-billing-payment";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useRefundBillingPayment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("has mutate/isPending", () => {
		const { result } = renderHook(() => useRefundBillingPayment(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
});
