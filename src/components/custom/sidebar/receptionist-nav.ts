import { CalendarDays, MonitorCheck, UserRound } from "lucide-react";

export const receptionistNav = [
	{
		label: "Recepção",
		items: [
			{
				title: "Painel de Recepção",
				url: "/dashboard/reception",
				icon: MonitorCheck,
			},
			{
				title: "Consultas",
				url: "/dashboard/appointments",
				icon: CalendarDays,
			},
			{
				title: "Pacientes",
				url: "/dashboard/patients",
				icon: UserRound,
			},
		],
	},
];
