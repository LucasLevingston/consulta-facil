import { z } from "zod";

export const updateBioSchema = z.object({
	bio: z.string().max(1000, "Máximo de 1000 caracteres").nullable().optional(),
});

export type UpdateBioInput = z.infer<typeof updateBioSchema>;
