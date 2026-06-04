export const DAYS = [
	{ key: "MONDAY", label: "Seg" },
	{ key: "TUESDAY", label: "Ter" },
	{ key: "WEDNESDAY", label: "Qua" },
	{ key: "THURSDAY", label: "Qui" },
	{ key: "FRIDAY", label: "Sex" },
	{ key: "SATURDAY", label: "Sáb" },
	{ key: "SUNDAY", label: "Dom" },
] as const;

export type DayKey = (typeof DAYS)[number]["key"];
