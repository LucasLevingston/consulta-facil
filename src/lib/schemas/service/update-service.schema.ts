import { z } from "zod";

export const updateServiceSchema = z.object({
	name: z.string().min(2).optional(),
	description: z.string().optional(),
	price: z.number().positive().optional(),
	durationMinutes: z.number().int().min(1).optional(),
	requiresConsultation: z.boolean().optional(),
});

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
