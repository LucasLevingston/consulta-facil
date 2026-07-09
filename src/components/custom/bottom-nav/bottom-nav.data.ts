import {
	BadgeCheck,
	CalendarClock,
	CalendarDays,
	CalendarPlus,
	Clock,
	Home,
	MonitorCheck,
	UserRound,
	Users,
} from "lucide-react";
import type React from "react";

export type NavItem = {
	title: string;
	url: string;
	icon: React.ComponentType<{ className?: string }>;
};

export const navByRole: Record<string, NavItem[]> = {
	PATIENT: [
		{ title: "Início", url: "/dashboard", icon: Home },
		{ title: "Consultas", url: "/dashboard/appointments", icon: CalendarDays },
		{
			title: "Agendar",
			url: "/dashboard/appointments/create",
			icon: CalendarPlus,
		},
		{
			title: "Solicitações",
			url: "/dashboard/procedure-requests",
			icon: CalendarClock,
		},
		{ title: "Profissionais", url: "/professionals", icon: Users },
	],
	PROFESSIONAL: [
		{ title: "Início", url: "/dashboard", icon: Home },
		{ title: "Consultas", url: "/dashboard/appointments", icon: CalendarDays },
		{ title: "Pacientes", url: "/dashboard/patients", icon: UserRound },
		{
			title: "Procedimentos",
			url: "/dashboard/procedure-requests",
			icon: CalendarClock,
		},
		{ title: "Horários", url: "/dashboard/schedule", icon: Clock },
	],
	RECEPTIONIST: [
		{ title: "Início", url: "/dashboard", icon: Home },
		{ title: "Recepção", url: "/dashboard/reception", icon: MonitorCheck },
		{ title: "Consultas", url: "/dashboard/appointments", icon: CalendarDays },
		{ title: "Pacientes", url: "/dashboard/patients", icon: UserRound },
	],
	ADMIN: [
		{ title: "Início", url: "/dashboard", icon: Home },
		{ title: "Consultas", url: "/dashboard/appointments", icon: CalendarDays },
		{ title: "Pacientes", url: "/dashboard/patients", icon: UserRound },
		{ title: "Admin", url: "/admin", icon: BadgeCheck },
	],
};
