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

import { useAdminBillingPayments } from "@/features/billing/hooks/use-admin-billing-payments";
import { useAdminInvoices } from "@/features/billing/hooks/use-admin-invoices";
import { useBillingPayment } from "@/features/billing/hooks/use-billing-payment";
import { useMyBillingPayments } from "@/features/billing/hooks/use-my-billing-payments";
import { useMyInvoices } from "@/features/billing/hooks/use-my-invoices";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("billing payment hooks", () => {
	beforeEach(() => vi.clearAllMocks());

	it("useAdminBillingPayments has data/isLoading", () => {
		const { result } = renderHook(() => useAdminBillingPayments(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
	it("useAdminInvoices has data/isLoading", () => {
		const { result } = renderHook(() => useAdminInvoices(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
	it("useMyInvoices has data/isLoading", () => {
		const { result } = renderHook(() => useMyInvoices(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
	it("useMyBillingPayments has data/isLoading", () => {
		const { result } = renderHook(() => useMyBillingPayments("u1"), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
	it("useBillingPayment has data/isLoading", () => {
		const { result } = renderHook(() => useBillingPayment("p1"), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});
