import { z } from "zod";

export const appointmentPaymentStatusSchema = z.enum([
	"UNPAID",
	"PENDING_PAYMENT",
	"PAID",
	"REFUNDED",
]);

export type AppointmentPaymentStatus = z.infer<
	typeof appointmentPaymentStatusSchema
>;
