import { z } from "zod";

export const availableSlotSchema = z.object({
	time: z.string(),
	available: z.boolean(),
});

export type AvailableSlot = z.infer<typeof availableSlotSchema>;
