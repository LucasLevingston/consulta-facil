import { LayoutDashboard, Stethoscope } from "lucide-react";
import type { QuickCard } from "./quick-card";

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
