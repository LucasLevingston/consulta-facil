import { z } from "zod";

export const rescheduleAppointmentSchema = z.object({
	scheduledAt: z.date(),
	reason: z.string().max(500).optional(),
});

export type RescheduleAppointmentInput = z.infer<
	typeof rescheduleAppointmentSchema
>;
