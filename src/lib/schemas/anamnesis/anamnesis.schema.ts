import { z } from "zod";

export const anamnesisSchema = z.object({
	chiefComplaint: z.string().optional(),
	currentMedications: z.string().optional(),
	allergies: z.string().optional(),
	medicalHistory: z.string().optional(),
	familyHistory: z.string().optional(),
	observations: z.string().optional(),
});

export type AnamnesisInput = z.infer<typeof anamnesisSchema>;
