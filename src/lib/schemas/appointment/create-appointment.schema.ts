import { z } from "zod";
import { paymentMethodSchema } from "../professional/payment-method.schema";
import { appointmentModalitySchema } from "./appointment-modality.schema";

export const createAppointmentSchema = z.object({
	professionalId: z.string().min(1, "Profissional é obrigatório"),
	scheduledAt: z.string().min(1, "Data e hora são obrigatórias"),
	reason: z.string().optional(),
	notes: z.string().optional(),
	modality: appointmentModalitySchema.optional(),
	serviceId: z.string().optional(),
	chosenPaymentMethod: paymentMethodSchema.optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
