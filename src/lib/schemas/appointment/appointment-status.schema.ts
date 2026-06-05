import { z } from "zod";

export const appointmentStatusSchema = z.enum([
	"PENDING",
	"CONFIRMED",
	"CHECKED_IN",
	"IN_PROGRESS",
	"CANCELED",
	"COMPLETED",
]);

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
