import {
	BadgeCheck,
	Briefcase,
	Building2,
	CalendarClock,
	CalendarDays,
	CalendarPlus,
	Clock,
	Home,
	MonitorCheck,
	Settings,
	TrendingUp,
	User,
	UserRound,
	Users,
} from "lucide-react";

export const defaultNav = [
	{
		label: "Home",
		items: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: Home,
				tooltip: "Visão geral da sua conta e atividades recentes",
			},
			{
				title: "Profissionais",
				url: "/professionals",
				icon: Users,
				tooltip: "Profissionais cadastrados na plataforma",
			},
			{
				title: "Clínicas",
				url: "/clinics",
				icon: Building2,
				tooltip: "Clínicas cadastradas na plataforma",
			},
		],
	},
];

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
		],
	},
];

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
