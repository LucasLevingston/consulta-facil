import {
	Building2,
	CalendarPlus,
	Clock,
	CreditCard,
	LayoutDashboard,
	Stethoscope,
	TrendingUp,
	User,
} from "lucide-react";

export interface QuickCard {
	title: string;
	description: string;
	href: string;
	icon: React.ElementType;
	accent: string;
}

export const patientCards: QuickCard[] = [
	{
		title: "Agendar Consulta",
		description: "Escolha um profissional e agende um horário.",
		href: "/dashboard/appointments/create",
		icon: CalendarPlus,
		accent: "bg-green-500/10 text-green-500",
	},
	{
		title: "Profissionais",
		description: "Explore profissionais cadastrados na plataforma.",
		href: "/professionals",
		icon: Stethoscope,
		accent: "bg-blue-500/10 text-blue-500",
	},
	{
		title: "Clínicas",
		description: "Encontre clínicas próximas de você.",
		href: "/clinics",
		icon: Building2,
		accent: "bg-teal-500/10 text-teal-500",
	},
	{
		title: "Meu Perfil",
		description: "Atualize seus dados pessoais e preferências.",
		href: "/dashboard/profile",
		icon: User,
		accent: "bg-purple-500/10 text-purple-500",
	},
];

export const doctorCards: QuickCard[] = [
	{
		title: "Agendar Consulta",
		description: "Marque uma nova consulta para um paciente.",
		href: "/dashboard/appointments/create",
		icon: CalendarPlus,
		accent: "bg-green-500/10 text-green-500",
	},
	{
		title: "Horários",
		description: "Gerencie sua disponibilidade semanal.",
		href: "/dashboard/schedule",
		icon: Clock,
		accent: "bg-blue-500/10 text-blue-500",
	},
	{
		title: "Financeiro",
		description: "Acompanhe sua receita e pagamentos.",
		href: "/dashboard/financial",
		icon: TrendingUp,
		accent: "bg-emerald-500/10 text-emerald-500",
	},
	{
		title: "Minha Clínica",
		description: "Gerencie sua clínica e membros.",
		href: "/dashboard/my-clinic",
		icon: Building2,
		accent: "bg-teal-500/10 text-teal-500",
	},
	{
		title: "Assinatura",
		description: "Gerencie seu plano e faturamento.",
		href: "/settings/billing",
		icon: CreditCard,
		accent: "bg-orange-500/10 text-orange-500",
	},
];

export const adminCards: QuickCard[] = [
	{
		title: "Painel Admin",
		description: "Acesso às configurações administrativas.",
		href: "/admin",
		icon: LayoutDashboard,
		accent: "bg-red-500/10 text-red-500",
	},
	{
		title: "Profissionais",
		description: "Veja todos os profissionais da plataforma.",
		href: "/professionals",
		icon: Stethoscope,
		accent: "bg-blue-500/10 text-blue-500",
	},
];
