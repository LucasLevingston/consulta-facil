import {
	Bell,
	Building2,
	CalendarCheck,
	CalendarX,
	Stethoscope,
} from "lucide-react";

export const NOTIFICATION_ICON = {
	CLINIC_INVITE: {
		icon: Building2,
		color: "text-primary",
		bg: "bg-primary/10",
	},
	GENERAL: { icon: Bell, color: "text-muted-foreground", bg: "bg-muted" },
	APPOINTMENT_SCHEDULED: {
		icon: Stethoscope,
		color: "text-blue-600",
		bg: "bg-blue-500/10",
	},
	APPOINTMENT_CONFIRMED: {
		icon: CalendarCheck,
		color: "text-green-600",
		bg: "bg-green-500/10",
	},
	APPOINTMENT_CANCELED: {
		icon: CalendarX,
		color: "text-red-500",
		bg: "bg-red-500/10",
	},
} as const;
