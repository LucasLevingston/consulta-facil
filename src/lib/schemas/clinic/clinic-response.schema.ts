import { z } from "zod";
import { clinicMemberSchema } from "./clinic-member.schema";

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

export type ClinicResponse = z.infer<typeof clinicResponseSchema>;
