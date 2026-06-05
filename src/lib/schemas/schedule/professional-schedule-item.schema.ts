import { z } from "zod";
import { DAYS_OF_WEEK } from "./days-of-week.schema";

const timeRegex = /^\d{2}:\d{2}$/;

export const professionalScheduleItemSchema = z.object({
	dayOfWeek: z.enum(DAYS_OF_WEEK),
	startTime: z.string().regex(timeRegex, "Formato HH:MM"),
	endTime: z.string().regex(timeRegex, "Formato HH:MM"),
	consultationDurationMinutes: z.number().min(5).max(480),
	breakBetweenConsultationsMinutes: z.number().min(0).max(120),
	isActive: z.boolean(),
});

export type ProfessionalScheduleItem = z.infer<
	typeof professionalScheduleItemSchema
>;
