import { z } from "zod";
import { appointmentModalitySchema } from "./appointment-modality.schema";

export const setModalitySchema = z.object({
	modality: appointmentModalitySchema,
	meetLink: z.string().optional(),
});

export type SetModalityInput = z.infer<typeof setModalitySchema>;
