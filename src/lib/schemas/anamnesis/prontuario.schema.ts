import { z } from "zod";

export const prontuarioSchema = z.object({
	clinicalNotes: z.string().optional(),
	diagnosis: z.string().optional(),
	diagnosisCid: z.string().optional(),
	prescription: z.string().optional(),
	examRequests: z.string().optional(),
	treatmentPlan: z.string().optional(),
	followUpInstructions: z.string().optional(),
});

export type ProntuarioInput = z.infer<typeof prontuarioSchema>;
