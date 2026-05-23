import { z } from "zod";

export const anamnesisSchema = z.object({
	chiefComplaint: z.string().optional(),
	currentMedications: z.string().optional(),
	allergies: z.string().optional(),
	medicalHistory: z.string().optional(),
	familyHistory: z.string().optional(),
	observations: z.string().optional(),
});

export const anamnesisResponseSchema = anamnesisSchema.extend({
	id: z.string(),
	appointmentId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const prontuarioSchema = z.object({
	clinicalNotes: z.string().optional(),
	diagnosis: z.string().optional(),
	diagnosisCid: z.string().optional(),
	prescription: z.string().optional(),
	examRequests: z.string().optional(),
	treatmentPlan: z.string().optional(),
	followUpInstructions: z.string().optional(),
});

export const prontuarioResponseSchema = prontuarioSchema.extend({
	id: z.string(),
	appointmentId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type AnamnesisInput = z.infer<typeof anamnesisSchema>;
export type AnamnesisResponse = z.infer<typeof anamnesisResponseSchema>;
export type ProntuarioInput = z.infer<typeof prontuarioSchema>;
export type ProntuarioResponse = z.infer<typeof prontuarioResponseSchema>;
