import { invoiceApi } from "@/lib/api/billing/invoice.api";
import { billingPaymentApi } from "@/lib/api/billing/payment.api";
import type { InvoiceResponse } from "@/lib/schemas/billing/invoice.schema";
import type {
	BillingPaymentResponse,
	CreateBillingPaymentValues,
} from "@/lib/schemas/billing/payment.schema";

export const billingPaymentRepository = {
	listMyInvoices: async (): Promise<InvoiceResponse[]> => invoiceApi.listMine(),
	listAllInvoices: async (): Promise<InvoiceResponse[]> => invoiceApi.listAll(),
	getInvoice: async (id: string): Promise<InvoiceResponse> =>
		invoiceApi.getById(id),
	getInvoiceByPayment: async (paymentId: string): Promise<InvoiceResponse> =>
		invoiceApi.getByPaymentId(paymentId),

	createPayment: async (
		data: CreateBillingPaymentValues,
	): Promise<BillingPaymentResponse> => billingPaymentApi.create(data),
	getPayment: async (id: string): Promise<BillingPaymentResponse> =>
		billingPaymentApi.getById(id),
	listMyPayments: async (payerId: string): Promise<BillingPaymentResponse[]> =>
		billingPaymentApi.myPayments(payerId),
	listAllPayments: async (): Promise<BillingPaymentResponse[]> =>
		billingPaymentApi.listAll(),
	cancelPayment: async (id: string): Promise<BillingPaymentResponse> =>
		billingPaymentApi.cancel(id),
	refundPayment: async (id: string): Promise<BillingPaymentResponse> =>
		billingPaymentApi.refund(id),
};
