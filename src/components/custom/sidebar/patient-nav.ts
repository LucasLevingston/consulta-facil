import {
	CalendarClock,
	CalendarDays,
	CalendarPlus,
	FlaskConical,
	MessageCircle,
	Users,
} from "lucide-react";

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
			{
				title: "Exames",
				url: "/dashboard/exams",
				icon: FlaskConical,
				tooltip: "Exames solicitados pelos seus profissionais",
			},
			{
				title: "Dependentes",
				url: "/dashboard/dependents",
				icon: Users,
			},
			{
				title: "Mensagens",
				url: "/dashboard/messages",
				icon: MessageCircle,
			},
		],
	},
];
