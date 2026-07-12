import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-payment.repository", () => ({
	billingPaymentRepository: {
		getInvoiceByPayment: vi.fn().mockResolvedValue(null),
	},
}));

import { useInvoiceByPayment } from "./use-invoice-by-payment";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useInvoiceByPayment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("has data/isLoading", () => {
		const { result } = renderHook(() => useInvoiceByPayment("pay1"), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});
