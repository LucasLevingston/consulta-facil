import { z } from "zod";

export const createProcedureRequestSchema = z.object({
	serviceId: z.string().min(1, "Serviço é obrigatório"),
	patientId: z.string().min(1, "Paciente é obrigatório"),
	notes: z.string().optional(),
});

export type CreateProcedureRequestInput = z.infer<
	typeof createProcedureRequestSchema
>;
