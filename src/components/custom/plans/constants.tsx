import { Crown, Zap } from "lucide-react";

import type { Plan } from "./types";

export const PLANS: Plan[] = [
	{
		id: "monthly",
		title: "Pro Mensal",
		monthlyEquiv: "149,90",
		totalPrice: "149,90",
		period: "/mês",
		description: "Acesso completo à plataforma com pagamento mensal.",
		icon: <Zap className="h-5 w-5" />,
		features: [
			"Consultas ilimitadas",
			"Dashboard completo",
			"Confirmação automática",
			"Suporte prioritário",
		],
	},
	{
		id: "yearly",
		title: "Pro Anual",
		monthlyEquiv: "134,91",
		totalPrice: "1.618,92",
		period: "/ano",
		description: "Economize 10% pagando anualmente.",
		icon: <Crown className="h-5 w-5" />,
		highlight: true,
		features: [
			"Tudo do plano mensal",
			"Economia de R$ 179,88/ano",
			"Badge de parceiro verificado",
			"Acesso antecipado a novidades",
		],
	},
];

export const SUBSCRIPTION_STATUS_COLOR: Record<string, string> = {
	ACTIVE: "bg-green-500/10 text-green-600 border-green-500/30",
	PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
	CANCELLED: "bg-red-500/10 text-red-600 border-red-500/30",
	EXPIRED: "bg-zinc-500/10 text-zinc-600 border-zinc-500/30",
};

export const SUBSCRIPTION_STATUS_LABEL: Record<string, string> = {
	ACTIVE: "Ativo",
	PENDING: "Pendente",
	CANCELLED: "Cancelado",
	EXPIRED: "Expirado",
};
