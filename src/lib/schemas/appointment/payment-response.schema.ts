import { z } from "zod";

export const paymentResponseSchema = z.object({
	checkoutUrl: z.string(),
	preferenceId: z.string(),
	appointmentId: z.string(),
});

export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
