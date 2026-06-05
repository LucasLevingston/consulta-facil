import { z } from "zod";
import { procedureRequestStatusSchema } from "./procedure-request-status.schema";

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

export type ProcedureRequest = z.infer<typeof procedureRequestSchema>;
