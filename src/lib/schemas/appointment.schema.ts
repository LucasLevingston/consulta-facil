import { z } from "zod";
import { paymentMethodSchema, paymentTimingSchema } from "./doctor.schema";

export const appointmentModalitySchema = z.enum(["IN_PERSON", "ONLINE"]);

export const appointmentPaymentStatusSchema = z.enum([
	"UNPAID",
	"PENDING_PAYMENT",
	"PAID",
	"REFUNDED",
]);

export const appointmentStatusSchema = z.enum([
	"PENDING",
	"CONFIRMED",
	"CHECKED_IN",
	"IN_PROGRESS",
	"CANCELED",
	"COMPLETED",
]);

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

export const createAppointmentSchema = z.object({
	professionalId: z.string().min(1, "Profissional é obrigatório"),
	scheduledAt: z.string().min(1, "Data e hora são obrigatórias"),
	reason: z.string().optional(),
	notes: z.string().optional(),
	modality: appointmentModalitySchema.optional(),
	serviceId: z.string().optional(),
	chosenPaymentMethod: paymentMethodSchema.optional(),
});

export const cancelAppointmentSchema = z.object({
	cancellationReason: z.string().min(1, "Motivo é obrigatório"),
});

export const rescheduleAppointmentSchema = z.object({
	scheduledAt: z.date(),
	reason: z.string().max(500).optional(),
});

export const rateAppointmentSchema = z.object({
	stars: z.number().int().min(1).max(5),
	comment: z.string().max(500).optional(),
});

// Form schema — scheduledAt is a Date object (converted to ISO string on submit)
export const appointmentFormSchema = z.object({
	professionalId: z.string().min(1, "Selecione o profissional"),
	userId: z.string().optional(),
	scheduledAt: z.date(),
	reason: z
		.string()
		.max(500, "Motivo deve ter no máximo 500 caracteres")
		.nullable()
		.optional(),
	notes: z.string().optional(),
	cancellationReason: z.string().optional(),
	modality: appointmentModalitySchema.optional(),
	serviceId: z.string().optional(),
	chosenPaymentMethod: paymentMethodSchema.optional(),
});

export const setModalitySchema = z.object({
	modality: appointmentModalitySchema,
	meetLink: z.string().optional(),
});

export const qrCheckInTokenSchema = z.object({
	appointmentId: z.string(),
	token: z.string(),
});

export const paymentResponseSchema = z.object({
	checkoutUrl: z.string(),
	preferenceId: z.string(),
	appointmentId: z.string(),
});

export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
export type AppointmentPaymentStatus = z.infer<
	typeof appointmentPaymentStatusSchema
>;
export type QrCheckInToken = z.infer<typeof qrCheckInTokenSchema>;
export type AppointmentModality = z.infer<typeof appointmentModalitySchema>;
export type SetModalityInput = z.infer<typeof setModalitySchema>;
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type AppointmentResponse = z.infer<typeof appointmentResponseSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;
export type RateAppointmentInput = z.infer<typeof rateAppointmentSchema>;
export type RescheduleAppointmentInput = z.infer<
	typeof rescheduleAppointmentSchema
>;
export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
