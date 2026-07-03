import { api } from "@/config/api";
import type { PaymentResponse } from "@/lib/schemas/appointment/payment-response.schema";

export const appointmentPaymentApi = {
	createPayment: async (
		appointmentId: string,
		amount?: number,
	): Promise<PaymentResponse> => {
		const params = amount !== undefined ? { amount } : {};
		const response = await api.post<PaymentResponse>(
			`/appointments/${appointmentId}/payment`,
			null,
			{ params },
		);
		return response.data;
	},
};
