import { z } from "zod";

export const clinicMemberSchema = z.object({
	professionalProfileId: z.string(),
	professionalName: z.string().nullable().optional(),
	specialty: z.string(),
	imageUrl: z.string().nullable().optional(),
	role: z.string(),
});
