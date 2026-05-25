import { z } from "zod";

export const procedureRequestStatusSchema = z.enum([
	"PENDING",
	"SCHEDULED",
	"COMPLETED",
	"CANCELED",
]);

export const procedureRequestSchema = z.object({
	id: z.string(),
	serviceId: z.string(),
	serviceName: z.string(),
	servicePrice: z.number(),
	serviceDurationMinutes: z.number().int(),
	patientId: z.string(),
	patientName: z.string().nullable().optional(),
	professionalId: z.string(),
	professionalName: z.string().nullable().optional(),
	appointmentId: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	status: procedureRequestStatusSchema,
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
});

export const createProcedureRequestSchema = z.object({
	serviceId: z.string().min(1, "Serviço é obrigatório"),
	patientId: z.string().min(1, "Paciente é obrigatório"),
	notes: z.string().optional(),
});

export const scheduleProcedureRequestSchema = z.object({
	scheduledAt: z.string().min(1, "Data e hora são obrigatórias"),
	modality: z.enum(["IN_PERSON", "ONLINE"]).optional(),
});

export type ProcedureRequestStatus = z.infer<
	typeof procedureRequestStatusSchema
>;
export type ProcedureRequest = z.infer<typeof procedureRequestSchema>;
export type CreateProcedureRequestInput = z.infer<
	typeof createProcedureRequestSchema
>;
export type ScheduleProcedureRequestInput = z.infer<
	typeof scheduleProcedureRequestSchema
>;
