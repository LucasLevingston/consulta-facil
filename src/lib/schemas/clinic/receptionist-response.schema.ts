import { z } from "zod";

export const receptionistResponseSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string(),
	email: z.string(),
	createdAt: z.string().nullable().optional(),
});

export type ReceptionistResponse = z.infer<typeof receptionistResponseSchema>;
