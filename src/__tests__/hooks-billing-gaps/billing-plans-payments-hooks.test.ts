import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/billing/plans.api", () => ({
	plansApi: {
		getActive: vi.fn(),
		getBySlug: vi.fn(),
		adminListAll: vi.fn(),
		adminCreate: vi.fn(),
		adminUpdate: vi.fn(),
		adminDeactivate: vi.fn(),
	},
}));
vi.mock("@/lib/api/billing/payment.api", () => ({
	billingPaymentApi: {
		create: vi.fn(),
		getById: vi.fn(),
		myPayments: vi.fn(),
		cancel: vi.fn(),
		refund: vi.fn(),
		listAll: vi.fn(),
	},
}));
vi.mock("@/lib/api/billing/invoice.api", () => ({
	invoiceApi: {
		listAll: vi.fn(),
		getById: vi.fn(),
		listMine: vi.fn(),
		getByPaymentId: vi.fn(),
	},
}));

import { useAdminCreatePlan } from "@/hooks/api/billing/use-admin-create-plan";
import { useAdminDeactivatePlan } from "@/hooks/api/billing/use-admin-deactivate-plan";
import { useCancelBillingPayment } from "@/hooks/api/billing/use-cancel-billing-payment";
import { useCreateBillingPayment } from "@/hooks/api/billing/use-create-billing-payment";
import { useInvoiceByPayment } from "@/hooks/api/billing/use-invoice-by-payment";
import { useRefundBillingPayment } from "@/hooks/api/billing/use-refund-billing-payment";
import { invoiceApi } from "@/lib/api/billing/invoice.api";
import { billingPaymentApi } from "@/lib/api/billing/payment.api";
import { plansApi } from "@/lib/api/billing/plans.api";

const mockAdminCreate = vi.mocked(plansApi.adminCreate);
const mockAdminDeactivate = vi.mocked(plansApi.adminDeactivate);
const mockCancel = vi.mocked(billingPaymentApi.cancel);
const mockCreate = vi.mocked(billingPaymentApi.create);
const mockRefund = vi.mocked(billingPaymentApi.refund);
const mockGetByPaymentId = vi.mocked(invoiceApi.getByPaymentId);

const plan = { id: "plan-1", slug: "premium", name: "Premium", price: 100 };
const payment = { id: "payment-1", status: "PENDING", amount: 100 };
const invoice = { id: "invoice-1", paymentId: "payment-1", amount: 100 };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAdminCreatePlan", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama adminCreate com os dados corretos", async () => {
		mockAdminCreate.mockResolvedValueOnce(plan as never);
		const { result } = renderHook(() => useAdminCreatePlan(), {
			wrapper: wrapper(),
		});
		const data = { slug: "premium", name: "Premium", price: 100 };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAdminCreate).toHaveBeenCalledWith(data);
	});
});

describe("useAdminDeactivatePlan", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama adminDeactivate com o id correto", async () => {
		mockAdminDeactivate.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useAdminDeactivatePlan(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("plan-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAdminDeactivate).toHaveBeenCalledWith("plan-1");
	});
});

describe("useCancelBillingPayment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama cancel com o id correto", async () => {
		mockCancel.mockResolvedValueOnce(payment as never);
		const { result } = renderHook(() => useCancelBillingPayment(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("payment-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCancel).toHaveBeenCalledWith("payment-1");
	});
});

describe("useCreateBillingPayment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama create com os dados corretos", async () => {
		mockCreate.mockResolvedValueOnce(payment as never);
		const { result } = renderHook(() => useCreateBillingPayment(), {
			wrapper: wrapper(),
		});
		const data = { payerId: "user-1", amount: 100, method: "PIX" };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCreate).toHaveBeenCalledWith(data);
	});
});

describe("useRefundBillingPayment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama refund com o id correto", async () => {
		mockRefund.mockResolvedValueOnce(payment as never);
		const { result } = renderHook(() => useRefundBillingPayment(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("payment-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockRefund).toHaveBeenCalledWith("payment-1");
	});
});

describe("useInvoiceByPayment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fica desabilitado quando paymentId está vazio", () => {
		const { result } = renderHook(() => useInvoiceByPayment(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("busca a fatura quando paymentId é fornecido", async () => {
		mockGetByPaymentId.mockResolvedValueOnce(invoice as never);
		const { result } = renderHook(() => useInvoiceByPayment("payment-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(invoice);
		expect(mockGetByPaymentId).toHaveBeenCalledWith("payment-1");
	});
});
