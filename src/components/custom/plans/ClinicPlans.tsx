"use client";

import { toast } from "sonner";
import { useMyClinic } from "@/hooks/api/clinics/use-my-clinic";
import { useCreateCheckout } from "@/hooks/api/subscriptions/use-create-checkout";
import { useMySubscription } from "@/hooks/api/subscriptions/use-my-subscription";
import { QueryBoundary } from "@/providers/query-boundary";
import { BASE_PRICE } from "@/utils/constants/base-price";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";
import { ClinicFreemiumInfo } from "./ClinicFreemiumInfo";
import { ClinicPriceCalculator } from "./ClinicPriceCalculator";
import { ClinicUsageCard } from "./ClinicUsageCard";
import { PlanCard } from "./plan-card";
import { SubscriptionBanner } from "./subscription-banner";
import type { Plan } from "./types";

function fmtBRL(value: number) {
	return value.toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

const CLINIC_PLANS: Plan[] = [
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

export default function ClinicPlans() {
	const { data: subscription, isLoading, error } = useMySubscription();
	const { data: myClinics = [] } = useMyClinic();
	const checkout = useCreateCheckout();

	const myClinic = myClinics[0] ?? null;
	const currentProfessionals = myClinic?.members?.length ?? 1;

	function handleSelect(planId: string) {
		checkout.mutate(planId, {
			onError: () => toast.error("Erro ao iniciar checkout."),
		});
	}

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<ClinicFreemiumInfo />

			{myClinic && <ClinicUsageCard clinic={myClinic} />}

			<ClinicPriceCalculator initialProfessionals={currentProfessionals} />

			{subscription &&
				subscription.status !== "EXPIRED" &&
				(subscription.planId === "clinic-monthly" ||
					subscription.planId === "clinic-yearly") && (
					<SubscriptionBanner subscription={subscription} />
				)}

			<div>
				<h2 className="text-lg font-semibold text-foreground">Planos pagos</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Necessário após esgotar as consultas gratuitas ou ao adicionar mais de{" "}
					{FREE_PROFESSIONALS} profissionais. O preço final varia conforme o
					número de profissionais.
				</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				{CLINIC_PLANS.map((plan) => (
					<PlanCard
						key={plan.id}
						plan={plan}
						subscription={subscription}
						onSelect={handleSelect}
						isPending={checkout.isPending}
					/>
				))}
			</div>
		</QueryBoundary>
	);
}
