import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-payment.repository", () => ({
	billingPaymentRepository: {
		listAllPayments: vi.fn().mockResolvedValue([]),
		listAllInvoices: vi.fn().mockResolvedValue([]),
		listMyInvoices: vi.fn().mockResolvedValue([]),
		listMyPayments: vi.fn().mockResolvedValue([]),
		getPayment: vi.fn().mockResolvedValue(null),
		getInvoice: vi.fn().mockResolvedValue(null),
		getInvoiceByPayment: vi.fn().mockResolvedValue(null),
		cancelPayment: vi.fn().mockResolvedValue(null),
		createPayment: vi.fn().mockResolvedValue(null),
		refundPayment: vi.fn().mockResolvedValue(null),
	},
}));

import { useCancelBillingPayment } from "@/features/billing/hooks/use-cancel-billing-payment";
import { useCreateBillingPayment } from "@/features/billing/hooks/use-create-billing-payment";
import { useInvoice } from "@/features/billing/hooks/use-invoice";
import { useInvoiceByPayment } from "@/features/billing/hooks/use-invoice-by-payment";
import { useRefundBillingPayment } from "@/features/billing/hooks/use-refund-billing-payment";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("billing payment hooks (part 2)", () => {
	beforeEach(() => vi.clearAllMocks());

	it("useInvoice has data/isLoading", () => {
		const { result } = renderHook(() => useInvoice("inv1"), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
	it("useInvoiceByPayment has data/isLoading", () => {
		const { result } = renderHook(() => useInvoiceByPayment("pay1"), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
	it("useCancelBillingPayment has mutate/isPending", () => {
		const { result } = renderHook(() => useCancelBillingPayment(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
	it("useCreateBillingPayment has mutate/isPending", () => {
		const { result } = renderHook(() => useCreateBillingPayment(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
	it("useRefundBillingPayment has mutate/isPending", () => {
		const { result } = renderHook(() => useRefundBillingPayment(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
});
