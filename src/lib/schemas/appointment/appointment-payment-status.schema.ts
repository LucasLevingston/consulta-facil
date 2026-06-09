import { z } from "zod";

export const appointmentPaymentStatusSchema = z.enum([
	"UNPAID",
	"PENDING_PAYMENT",
	"PAID",
	"REFUNDED",
	"FREE",
]);

export type AppointmentPaymentStatus = z.infer<
	typeof appointmentPaymentStatusSchema
>;
