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

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
