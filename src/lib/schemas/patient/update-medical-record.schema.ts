import { z } from "zod";

import { bloodTypeSchema } from "./medical-record.schema";

export const updateMedicalRecordSchema = z.object({
	allergies: z.string().optional(),
	currentMedication: z.string().optional(),
	familyMedicalHistory: z.string().optional(),
	pastMedicalHistory: z.string().optional(),
	privacyConsent: z.boolean().optional(),
	treatmentConsent: z.boolean().optional(),
	disclosureConsent: z.boolean().optional(),
	bloodType: bloodTypeSchema.nullable().optional(),
	height: z.number().min(0.5).max(2.7).nullable().optional(),
	weight: z.number().min(1).max(500).nullable().optional(),
});

export type UpdateMedicalRecordInput = z.infer<
	typeof updateMedicalRecordSchema
>;
