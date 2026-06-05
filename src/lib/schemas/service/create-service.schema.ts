import { z } from "zod";

export const createServiceSchema = z.object({
	name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
	description: z.string().optional(),
	price: z.number().positive("Preço deve ser positivo"),
	durationMinutes: z.number().int().min(1, "Duração mínima é 1 minuto"),
	requiresConsultation: z.boolean(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
