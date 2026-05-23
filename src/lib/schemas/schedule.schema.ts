import { z } from "zod";

export const DAYS_OF_WEEK = [
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
] as const;

export const DAY_LABELS: Record<(typeof DAYS_OF_WEEK)[number], string> = {
	MONDAY: "Segunda",
	TUESDAY: "Terça",
	WEDNESDAY: "Quarta",
	THURSDAY: "Quinta",
	FRIDAY: "Sexta",
	SATURDAY: "Sábado",
	SUNDAY: "Domingo",
};

const timeRegex = /^\d{2}:\d{2}$/;

export const professionalScheduleItemSchema = z.object({
	dayOfWeek: z.enum(DAYS_OF_WEEK),
	startTime: z.string().regex(timeRegex, "Formato HH:MM"),
	endTime: z.string().regex(timeRegex, "Formato HH:MM"),
	consultationDurationMinutes: z.number().min(5).max(480),
	breakBetweenConsultationsMinutes: z.number().min(0).max(120),
	isActive: z.boolean(),
});

export const professionalScheduleResponseSchema =
	professionalScheduleItemSchema.extend({
		id: z.string(),
		professionalProfileId: z.string(),
	});

export const clinicWorkingHoursItemSchema = z.object({
	dayOfWeek: z.enum(DAYS_OF_WEEK),
	openTime: z.string().regex(timeRegex, "Formato HH:MM"),
	closeTime: z.string().regex(timeRegex, "Formato HH:MM"),
	isOpen: z.boolean(),
});

export const clinicWorkingHoursResponseSchema =
	clinicWorkingHoursItemSchema.extend({
		id: z.string(),
		clinicId: z.string(),
	});

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
export type ProfessionalScheduleItem = z.infer<
	typeof professionalScheduleItemSchema
>;
export type ProfessionalScheduleResponse = z.infer<
	typeof professionalScheduleResponseSchema
>;
export type ClinicWorkingHoursItem = z.infer<
	typeof clinicWorkingHoursItemSchema
>;
export type ClinicWorkingHoursResponse = z.infer<
	typeof clinicWorkingHoursResponseSchema
>;
