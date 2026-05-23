import { z } from "zod";

export const clinicMemberSchema = z.object({
	professionalProfileId: z.string(),
	professionalName: z.string().nullable().optional(),
	specialty: z.string(),
	imageUrl: z.string().nullable().optional(),
	role: z.string(),
});

export const clinicResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	zipCode: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	status: z.string(),
	ownerId: z.string(),
	ownerName: z.string().nullable().optional(),
	members: z.array(clinicMemberSchema).optional(),
	createdAt: z.string().nullable().optional(),
});

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

export type ClinicResponse = z.infer<typeof clinicResponseSchema>;
export type CreateClinicInput = z.infer<typeof createClinicSchema>;
