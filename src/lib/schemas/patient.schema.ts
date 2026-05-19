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

export const updatePatientSchema = z.object({
  occupation: z.string().optional(),
});

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

export const updateMedicalRecordSchema = z.object({
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  privacyConsent: z.boolean().optional(),
  treatmentConsent: z.boolean().optional(),
  disclosureConsent: z.boolean().optional(),
});

export type PatientProfile = z.infer<typeof patientProfileSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type MedicalRecord = z.infer<typeof medicalRecordSchema>;
export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>;
