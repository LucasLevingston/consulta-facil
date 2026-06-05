import { CalendarClock, CalendarDays, CalendarPlus } from "lucide-react";

export const patientNav = [
	{
		label: "Consultas",
		items: [
			{
				title: "Minhas Consultas",
				url: "/dashboard/appointments",
				icon: CalendarDays,
			},
			{
				title: "Agendar Consulta",
				url: "/dashboard/appointments/create",
				icon: CalendarPlus,
			},
			{
				title: "Solicitações",
				url: "/dashboard/procedure-requests",
				icon: CalendarClock,
				tooltip: "Procedimentos solicitados pelo seu profissional",
			},
		],
	},
];
