import { z } from "zod";

export const rateAppointmentSchema = z.object({
	stars: z.number().int().min(1).max(5),
	comment: z.string().max(500).optional(),
});

export type RateAppointmentInput = z.infer<typeof rateAppointmentSchema>;
