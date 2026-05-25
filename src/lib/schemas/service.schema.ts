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

export const createServiceSchema = z.object({
	name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
	description: z.string().optional(),
	price: z.number().positive("Preço deve ser positivo"),
	durationMinutes: z.number().int().min(1, "Duração mínima é 1 minuto"),
	requiresConsultation: z.boolean(),
});

export const updateServiceSchema = z.object({
	name: z.string().min(2).optional(),
	description: z.string().optional(),
	price: z.number().positive().optional(),
	durationMinutes: z.number().int().min(1).optional(),
	requiresConsultation: z.boolean().optional(),
});

export type ProfessionalService = z.infer<typeof professionalServiceSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
