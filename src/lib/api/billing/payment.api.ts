import { api } from "@/config/api";
import type {
	BillingPaymentResponse,
	CreateBillingPaymentValues,
} from "@/lib/schemas/billing/payment.schema";

export const billingPaymentApi = {
	create: async (
		data: CreateBillingPaymentValues,
	): Promise<BillingPaymentResponse> => {
		const res = await api.post<BillingPaymentResponse>(
			"/billing/payments",
			data,
		);
		return res.data;
	},

	getById: async (id: string): Promise<BillingPaymentResponse> => {
		const res = await api.get<BillingPaymentResponse>(
			`/billing/payments/${id}`,
		);
		return res.data;
	},

	myPayments: async (payerId: string): Promise<BillingPaymentResponse[]> => {
		const res = await api.get<BillingPaymentResponse[]>(
			"/billing/payments/me",
			{ params: { payerId } },
		);
		return res.data;
	},

	cancel: async (id: string): Promise<BillingPaymentResponse> => {
		const res = await api.post<BillingPaymentResponse>(
			`/billing/payments/${id}/cancel`,
		);
		return res.data;
	},

	refund: async (id: string): Promise<BillingPaymentResponse> => {
		const res = await api.post<BillingPaymentResponse>(
			`/billing/payments/${id}/refund`,
		);
		return res.data;
	},

	listAll: async (): Promise<BillingPaymentResponse[]> => {
		const res = await api.get<BillingPaymentResponse[]>(
			"/admin/billing/payments",
		);
		return res.data;
	},
};
