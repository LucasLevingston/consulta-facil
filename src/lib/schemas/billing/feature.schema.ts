import { z } from "zod";

export const createFeatureSchema = z.object({
	key: z.string().min(2, "key é obrigatório"),
	name: z.string().min(2, "name é obrigatório"),
	description: z.string().optional(),
});

export const updateFeatureSchema = z.object({
	name: z.string().min(2).optional(),
	description: z.string().optional(),
});

export type CreateFeatureValues = z.infer<typeof createFeatureSchema>;
export type UpdateFeatureValues = z.infer<typeof updateFeatureSchema>;

export interface FeatureResponse {
	id: string;
	key: string;
	name: string;
	description: string | null;
	createdAt: string;
}
