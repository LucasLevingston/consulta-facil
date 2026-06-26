import { api } from "@/config/api";
import type { InvoiceResponse } from "@/lib/schemas/billing/invoice.schema";

export const invoiceApi = {
	listAll: async (): Promise<InvoiceResponse[]> => {
		const res = await api.get<InvoiceResponse[]>("/admin/billing/invoices");
		return res.data;
	},

	getById: async (id: string): Promise<InvoiceResponse> => {
		const res = await api.get<InvoiceResponse>(`/admin/billing/invoices/${id}`);
		return res.data;
	},

	listMine: async (): Promise<InvoiceResponse[]> => {
		const res = await api.get<InvoiceResponse[]>("/billing/invoices");
		return res.data;
	},

	getByPaymentId: async (paymentId: string): Promise<InvoiceResponse> => {
		const res = await api.get<InvoiceResponse>(
			`/billing/invoices/by-payment/${paymentId}`,
		);
		return res.data;
	},
};
