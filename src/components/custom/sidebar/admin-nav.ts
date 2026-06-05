import {
	BadgeCheck,
	Briefcase,
	CalendarClock,
	CalendarDays,
	Settings,
	User,
} from "lucide-react";

export const adminNav = [
	{
		label: "Administração",
		items: [
			{
				title: "Consultas",
				url: "/dashboard/appointments",
				icon: CalendarDays,
			},
			{
				title: "Pacientes",
				url: "/dashboard/patients",
				icon: BadgeCheck,
			},
			{
				title: "Admin Dashboard",
				url: "/admin",
				icon: Settings,
			},
		],
	},
	{
		label: "Procedimentos",
		items: [
			{
				title: "Meus Serviços",
				url: "/dashboard/services",
				icon: Briefcase,
			},
			{
				title: "Solicitações",
				url: "/dashboard/procedure-requests",
				icon: CalendarClock,
			},
		],
	},
	{
		label: "Conta",
		items: [
			{
				title: "Meu Perfil",
				url: "/dashboard/profile",
				icon: User,
			},
			{
				title: "Configurações",
				url: "/settings",
				icon: Settings,
			},
		],
	},
];
