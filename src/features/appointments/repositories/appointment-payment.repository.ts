import { appointmentPaymentApi } from "@/lib/api/appointments/appointment-payment.api";
import type { PaymentResponse } from "@/lib/schemas/appointment/payment-response.schema";

export const appointmentPaymentRepository = {
	createPayment: (
		appointmentId: string,
		amount?: number,
	): Promise<PaymentResponse> =>
		appointmentPaymentApi.createPayment(appointmentId, amount),
};
