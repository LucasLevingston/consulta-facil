import { z } from "zod";

export const CreateAppointmentSchema = z.object({
  doctorId: z.string().min(1, "Selecione o médico"),
  userId: z.string().optional(),
  scheduledAt: z.date(),
  reason: z.string().max(500, "Motivo deve ter no máximo 500 caracteres").nullable().optional(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof CreateAppointmentSchema>;
