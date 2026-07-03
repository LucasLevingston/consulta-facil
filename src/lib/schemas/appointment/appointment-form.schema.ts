import { z } from "zod";
import { paymentMethodSchema } from "../professional/payment-method.schema";
import { appointmentModalitySchema } from "./appointment-modality.schema";

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

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
