import { z } from "zod";

export const loginResponseSchema = z.object({
	token: z.string(),
	type: z.string(),
	expiresIn: z.number(),
	userId: z.string(),
	email: z.string(),
	role: z.enum(["PATIENT", "PROFESSIONAL", "ADMIN", "RECEPTIONIST"]),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
