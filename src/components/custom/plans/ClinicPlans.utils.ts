import { BASE_PRICE } from "@/utils/constants/base-price";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";
import type { Plan } from "./types";

export function fmtBRL(value: number) {
	return value.toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export const clinicPlans: Plan[] = [
	{
		id: "clinic-monthly",
		title: "Clínica Mensal",
		monthlyEquiv: fmtBRL(BASE_PRICE),
		totalPrice: fmtBRL(BASE_PRICE),
		period: "/mês",
		description: `Para clínicas com até ${FREE_PROFESSIONALS} profissionais. Cada profissional extra soma +20%.`,
		icon: null,
		features: [
			`${FREE_PROFESSIONALS} profissionais incluídos no preço base`,
			"Consultas ilimitadas após o período grátis",
			"Perfil de clínica no mapa",
			"Badge de clínica verificada",
		],
	},
	{
		id: "clinic-yearly",
		title: "Clínica Anual",
		monthlyEquiv: fmtBRL(BASE_PRICE * 0.9),
		totalPrice: fmtBRL(BASE_PRICE * 12 * 0.9),
		period: "/ano",
		description: "Economize 10% pagando anualmente.",
		icon: null,
		highlight: true,
		features: [
			"Tudo do plano mensal",
			`Economia de R$ ${fmtBRL(BASE_PRICE * 12 * 0.1)}/ano`,
			"Destaque nos resultados de busca",
			"Relatórios de agendamentos",
		],
	},
];
