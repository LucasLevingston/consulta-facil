import { z } from "zod";

export const bloodTypeSchema = z.enum([
	"A_POSITIVE",
	"A_NEGATIVE",
	"B_POSITIVE",
	"B_NEGATIVE",
	"AB_POSITIVE",
	"AB_NEGATIVE",
	"O_POSITIVE",
	"O_NEGATIVE",
]);

export const medicalRecordSchema = z.object({
	id: z.string().optional(),
	allergies: z.string().nullable().optional(),
	currentMedication: z.string().nullable().optional(),
	familyMedicalHistory: z.string().nullable().optional(),
	pastMedicalHistory: z.string().nullable().optional(),
	privacyConsent: z.boolean().nullable().optional(),
	treatmentConsent: z.boolean().nullable().optional(),
	disclosureConsent: z.boolean().nullable().optional(),
	bloodType: bloodTypeSchema.nullable().optional(),
	height: z.number().nullable().optional(),
	weight: z.number().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
});

export type MedicalRecord = z.infer<typeof medicalRecordSchema>;
