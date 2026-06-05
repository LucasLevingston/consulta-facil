import { z } from "zod";
import { DAYS_OF_WEEK } from "./days-of-week.schema";

const timeRegex = /^\d{2}:\d{2}$/;

export const clinicWorkingHoursItemSchema = z.object({
	dayOfWeek: z.enum(DAYS_OF_WEEK),
	openTime: z.string().regex(timeRegex, "Formato HH:MM"),
	closeTime: z.string().regex(timeRegex, "Formato HH:MM"),
	isOpen: z.boolean(),
});

export type ClinicWorkingHoursItem = z.infer<
	typeof clinicWorkingHoursItemSchema
>;
