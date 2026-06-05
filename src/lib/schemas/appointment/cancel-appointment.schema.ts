import { z } from "zod";

export const cancelAppointmentSchema = z.object({
	cancellationReason: z.string().min(1, "Motivo é obrigatório"),
});

export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;
