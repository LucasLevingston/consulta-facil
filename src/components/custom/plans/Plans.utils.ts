import type { ReactNode } from "react";
import type { PlanResponse } from "@/features/plans";
import type { Plan } from "./types";

const HIGHLIGHT_TIERS = new Set(["PRO"]);

export function apiPlanToUiPlan(p: PlanResponse, icon: ReactNode): Plan {
	const limitLabel =
		p.maxAppointments !== null && p.maxAppointments !== undefined
			? `Até ${p.maxAppointments} consultas/mês`
			: "Consultas ilimitadas";
	return {
		id: p.slug,
		title: p.name,
		monthlyEquiv:
			p.price === 0
				? "0,00"
				: p.price.toLocaleString("pt-BR", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}),
		totalPrice:
			p.price === 0
				? "Grátis"
				: p.price.toLocaleString("pt-BR", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}),
		period: "/mês",
		description: p.description ?? "",
		features: [...p.features, limitLabel],
		highlight: HIGHLIGHT_TIERS.has(p.tier),
		icon,
		maxAppointments: p.maxAppointments,
	};
}
