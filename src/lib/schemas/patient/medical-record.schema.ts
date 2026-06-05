import { z } from "zod";

export const medicalRecordSchema = z.object({
	id: z.string().optional(),
	allergies: z.string().nullable().optional(),
	currentMedication: z.string().nullable().optional(),
	familyMedicalHistory: z.string().nullable().optional(),
	pastMedicalHistory: z.string().nullable().optional(),
	privacyConsent: z.boolean().nullable().optional(),
	treatmentConsent: z.boolean().nullable().optional(),
	disclosureConsent: z.boolean().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
});

export type MedicalRecord = z.infer<typeof medicalRecordSchema>;
