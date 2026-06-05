import { z } from "zod";

export const scheduleProcedureRequestSchema = z.object({
	scheduledAt: z.string().min(1, "Data e hora são obrigatórias"),
	modality: z.enum(["IN_PERSON", "ONLINE"]).optional(),
});

export type ScheduleProcedureRequestInput = z.infer<
	typeof scheduleProcedureRequestSchema
>;
