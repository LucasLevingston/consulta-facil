import { z } from "zod";

export const createClinicSchema = z.object({
	name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
	description: z.string().optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zipCode: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	imageUrl: z.string().optional(),
});

export type CreateClinicInput = z.infer<typeof createClinicSchema>;
