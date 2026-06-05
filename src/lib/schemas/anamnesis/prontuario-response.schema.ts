import { z } from "zod";
import { prontuarioSchema } from "./prontuario.schema";

export const prontuarioResponseSchema = prontuarioSchema.extend({
	id: z.string(),
	appointmentId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type ProntuarioResponse = z.infer<typeof prontuarioResponseSchema>;
