import { z } from "zod";

export const notificationSchema = z.object({
	id: z.string(),
	type: z.enum([
		"CLINIC_INVITE",
		"GENERAL",
		"APPOINTMENT_SCHEDULED",
		"APPOINTMENT_CONFIRMED",
		"APPOINTMENT_CANCELED",
	]),
	title: z.string(),
	message: z.string(),
	status: z.enum(["PENDING", "ACCEPTED", "DECLINED", "READ"]),
	clinicId: z.string().nullable().optional(),
	clinicName: z.string().nullable().optional(),
	professionalProfileId: z.string().nullable().optional(),
	createdAt: z.string(),
});

export const unreadCountSchema = z.object({
	count: z.number(),
});

export type NotificationResponse = z.infer<typeof notificationSchema>;
