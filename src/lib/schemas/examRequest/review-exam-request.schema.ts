import { z } from "zod";

export const reviewExamRequestSchema = z.object({
	professionalNotes: z
		.string()
		.min(1, "Observações são obrigatórias")
		.max(2000),
});

export type ReviewExamRequestInput = z.infer<typeof reviewExamRequestSchema>;
