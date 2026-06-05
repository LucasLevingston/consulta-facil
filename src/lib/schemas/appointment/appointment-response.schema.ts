import { z } from "zod";
import { paymentMethodSchema } from "../doctor/payment-method.schema";
import { paymentTimingSchema } from "../doctor/payment-timing.schema";
import { appointmentModalitySchema } from "./appointment-modality.schema";
import { appointmentPaymentStatusSchema } from "./appointment-payment-status.schema";
import { appointmentStatusSchema } from "./appointment-status.schema";

export const appointmentResponseSchema = z.object({
	id: z.string(),
	patientName: z.string().nullable().optional(),
	patientId: z.string(),
	professionalName: z.string().nullable().optional(),
	professionalId: z.string(),
	specialty: z.string().nullable().optional(),
	scheduledAt: z.string(),
	previousScheduledAt: z.string().nullable().optional(),
	checkedInAt: z.string().nullable().optional(),
	calledAt: z.string().nullable().optional(),
	reason: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	modality: appointmentModalitySchema.nullable().optional(),
	meetLink: z.string().nullable().optional(),
	status: appointmentStatusSchema,
	paymentStatus: appointmentPaymentStatusSchema.nullable().optional(),
	paymentAmount: z.number().nullable().optional(),
	chosenPaymentMethod: paymentMethodSchema.nullable().optional(),
	paymentTiming: paymentTimingSchema.nullable().optional(),
	checkoutUrl: z.string().nullable().optional(),
	cancellationReason: z.string().nullable().optional(),
	rating: z.number().int().min(1).max(5).nullable().optional(),
	ratingComment: z.string().nullable().optional(),
	serviceId: z.string().nullable().optional(),
	serviceName: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
});

export type AppointmentResponse = z.infer<typeof appointmentResponseSchema>;
