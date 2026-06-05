import { z } from "zod";

export const updatePatientSchema = z.object({
	occupation: z.string().optional(),
});

export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
