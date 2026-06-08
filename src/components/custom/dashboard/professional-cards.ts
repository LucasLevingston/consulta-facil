import {
	Building2,
	CalendarPlus,
	Clock,
	CreditCard,
	TrendingUp,
} from "lucide-react";
import type { QuickCard } from "./quick-card";

export const professionalCards: QuickCard[] = [
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
