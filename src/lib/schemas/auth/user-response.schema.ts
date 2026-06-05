import { z } from "zod";

export const userResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	role: z.enum(["PATIENT", "PROFESSIONAL", "ADMIN", "RECEPTIONIST"]),
	phone: z.string().nullable().optional(),
	cpf: z.string().nullable().optional(),
	birthDate: z.string().nullable().optional(),
	gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
