import { z } from "zod";

export const appointmentStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELED",
  "COMPLETED",
]);

export const appointmentResponseSchema = z.object({
  id: z.string(),
  patientName: z.string().nullable().optional(),
  patientId: z.string(),
  doctorName: z.string().nullable().optional(),
  doctorId: z.string(),
  specialty: z.string().nullable().optional(),
  scheduledAt: z.string(),
  reason: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: appointmentStatusSchema,
  cancellationReason: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const createAppointmentSchema = z.object({
  doctorId: z.string().min(1, "Médico é obrigatório"),
  scheduledAt: z.string().min(1, "Data e hora são obrigatórias"),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const cancelAppointmentSchema = z.object({
  cancellationReason: z.string().min(1, "Motivo é obrigatório"),
});

// Form schema — scheduledAt is a Date object (converted to ISO string on submit)
export const appointmentFormSchema = z.object({
  doctorId: z.string().min(1, "Selecione o médico"),
  userId: z.string().optional(),
  scheduledAt: z.date(),
  reason: z.string().max(500, "Motivo deve ter no máximo 500 caracteres").nullable().optional(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type AppointmentResponse = z.infer<typeof appointmentResponseSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;
export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
