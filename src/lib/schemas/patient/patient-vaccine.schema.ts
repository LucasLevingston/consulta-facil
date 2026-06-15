import { z } from "zod";

export const patientVaccineSchema = z.object({
	id: z.string().optional(),
	vaccineName: z.string().min(2),
	doseNumber: z.string().optional(),
	administeredAt: z.string().optional(),
	notes: z.string().max(500).optional(),
});

export type PatientVaccineInput = z.infer<typeof patientVaccineSchema>;

export interface PatientVaccineResponse {
	id: string;
	vaccineName: string;
	doseNumber?: string | null;
	administeredAt?: string | null;
	notes?: string | null;
}
