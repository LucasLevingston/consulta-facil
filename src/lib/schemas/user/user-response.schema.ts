import { z } from "zod";

export const userRoleSchema = z.enum([
	"PATIENT",
	"PROFESSIONAL",
	"ADMIN",
	"RECEPTIONIST",
]);

export type UserRole = z.infer<typeof userRoleSchema>;

export const userResponseSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	role: userRoleSchema.nullable().optional(),
	phone: z.string().nullable().optional(),
	cpf: z.string().nullable().optional(),
	birthDate: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
