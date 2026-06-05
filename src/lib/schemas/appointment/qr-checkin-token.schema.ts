import { z } from "zod";

export const qrCheckInTokenSchema = z.object({
	appointmentId: z.string(),
	token: z.string(),
});

export type QrCheckInToken = z.infer<typeof qrCheckInTokenSchema>;
