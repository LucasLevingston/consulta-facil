import { z } from "zod";

export const createExamRequestSchema = z.object({
	examName: z.string().min(1, "Nome do exame é obrigatório"),
	instructions: z.string().max(1000).optional(),
});

export type CreateExamRequestInput = z.infer<typeof createExamRequestSchema>;
