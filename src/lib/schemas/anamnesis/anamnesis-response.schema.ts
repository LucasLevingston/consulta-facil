import { z } from "zod";
import { anamnesisSchema } from "./anamnesis.schema";

export const anamnesisResponseSchema = anamnesisSchema.extend({
	id: z.string(),
	appointmentId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type AnamnesisResponse = z.infer<typeof anamnesisResponseSchema>;
