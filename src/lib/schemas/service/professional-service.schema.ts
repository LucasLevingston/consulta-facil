import { z } from "zod";

export const professionalServiceSchema = z.object({
	id: z.string(),
	professionalId: z.string(),
	professionalName: z.string().nullable().optional(),
	name: z.string(),
	description: z.string().nullable().optional(),
	price: z.number(),
	durationMinutes: z.number().int(),
	requiresConsultation: z.boolean(),
	active: z.boolean(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
});

export type ProfessionalService = z.infer<typeof professionalServiceSchema>;
