import {
	Briefcase,
	Building2,
	CalendarClock,
	CalendarDays,
	CalendarPlus,
	Clock,
	CreditCard,
	FlaskConical,
	TrendingUp,
	UserRound,
} from "lucide-react";

export const doctorNav = [
	{
		label: "Consultas",
		items: [
			{
				title: "Consultas",
				url: "/dashboard/appointments",
				icon: CalendarDays,
			},
			{
				title: "Agendar Consulta",
				url: "/dashboard/appointments/create",
				icon: CalendarPlus,
			},
		],
	},
	{
		label: "Pacientes",
		items: [
			{
				title: "Pacientes",
				url: "/dashboard/patients",
				icon: UserRound,
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
				tooltip: "Serviços e procedimentos que você oferece",
			},
			{
				title: "Solicitações",
				url: "/dashboard/procedure-requests",
				icon: CalendarClock,
				tooltip: "Solicitações de procedimento para pacientes",
			},
			{
				title: "Exames",
				url: "/dashboard/exams",
				icon: FlaskConical,
				tooltip: "Exames solicitados para seus pacientes",
			},
		],
	},
	{
		label: "Clínica",
		items: [
			{
				title: "Minha Clínica",
				url: "/dashboard/my-clinic",
				icon: Building2,
			},
			{
				title: "Horários",
				url: "/dashboard/schedule",
				icon: Clock,
			},
		],
	},
	{
		label: "Financeiro",
		items: [
			{
				title: "Financeiro",
				url: "/dashboard/financial",
				icon: TrendingUp,
			},
			{
				title: "Pagamentos",
				url: "/dashboard/payments",
				icon: CreditCard,
			},
		],
	},
];
