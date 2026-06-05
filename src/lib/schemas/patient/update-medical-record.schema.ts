import { z } from "zod";

export const updateMedicalRecordSchema = z.object({
	allergies: z.string().optional(),
	currentMedication: z.string().optional(),
	familyMedicalHistory: z.string().optional(),
	pastMedicalHistory: z.string().optional(),
	privacyConsent: z.boolean().optional(),
	treatmentConsent: z.boolean().optional(),
	disclosureConsent: z.boolean().optional(),
});

export type UpdateMedicalRecordInput = z.infer<
	typeof updateMedicalRecordSchema
>;
