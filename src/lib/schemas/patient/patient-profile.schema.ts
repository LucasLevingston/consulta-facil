import { z } from "zod";

export const patientProfileSchema = z.object({
	id: z.string().optional(),
	userId: z.string().optional(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	cpf: z.string().nullable().optional(),
	birthDate: z.string().nullable().optional(),
	gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	occupation: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
});

export type PatientProfile = z.infer<typeof patientProfileSchema>;
