import type { AnalyticsPeriod } from "@/features/analytics";

export const ANALYTICS_PERIOD_OPTIONS: {
	value: AnalyticsPeriod;
	label: string;
}[] = [
	{ value: "30d", label: "30 dias" },
	{ value: "90d", label: "90 dias" },
	{ value: "12m", label: "12 meses" },
];

export const WEEKDAY_LABELS: Record<string, string> = {
	MONDAY: "Seg",
	TUESDAY: "Ter",
	WEDNESDAY: "Qua",
	THURSDAY: "Qui",
	FRIDAY: "Sex",
	SATURDAY: "Sáb",
	SUNDAY: "Dom",
};

export const MODALITY_LABELS: Record<string, string> = {
	IN_PERSON: "Presencial",
	ONLINE: "Online",
};

export const RATING_STARS = ["5", "4", "3", "2", "1"];
