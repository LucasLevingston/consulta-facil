"use client";

import { BadgeCheck, Building2, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import type { PlanResponse } from "@/features/plans";
import { usePlans } from "@/features/plans";
import { useCreateCheckout, useMySubscription } from "@/features/subscriptions";
import { QueryBoundary } from "@/providers/query-boundary";
import { PRO_PLAN_IDS } from "../../../utils/constants/pro-plan-ids";
import { PlanCard } from "./plan-card";
import { SubscriptionBanner } from "./subscription-banner";
import type { Plan } from "./types";

const TIER_ICONS: Record<string, React.ReactNode> = {
	FREE: <BadgeCheck className="h-5 w-5" />,
	STARTER: <Zap className="h-5 w-5" />,
	PRO: <Sparkles className="h-5 w-5" />,
	CLINIC: <Building2 className="h-5 w-5" />,
};

const HIGHLIGHT_TIERS = new Set(["PRO"]);

function apiPlanToUiPlan(p: PlanResponse): Plan {
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
		icon: TIER_ICONS[p.tier] ?? <Zap className="h-5 w-5" />,
		maxAppointments: p.maxAppointments,
	};
}

export default function Plans() {
	const {
		data: plansData,
		isLoading: plansLoading,
		error: plansError,
	} = usePlans();
	const {
		data: subscription,
		isLoading: subLoading,
		error: subError,
	} = useMySubscription();
	const checkout = useCreateCheckout();

	function handleSelect(planId: string) {
		checkout.mutate(planId, {
			onError: () => toast.error("Erro ao iniciar checkout."),
		});
	}

	const hasActiveSubscription =
		subscription &&
		subscription.status === "ACTIVE" &&
		PRO_PLAN_IDS.has(subscription.planId);

	const plans = (plansData ?? [])
		.sort((a, b) => a.displayOrder - b.displayOrder)
		.map(apiPlanToUiPlan);

	return (
		<QueryBoundary
			isLoading={plansLoading || subLoading}
			error={plansError ?? subError}
		>
			{subscription && subscription.status !== "EXPIRED" && (
				<SubscriptionBanner subscription={subscription} />
			)}

			<div className="space-y-6">
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Planos disponíveis
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Escolha o plano ideal para seu volume de consultas e funcionalidades
						necessárias.
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{plans.map((plan) => (
						<PlanCard
							key={plan.id}
							plan={plan}
							subscription={hasActiveSubscription ? subscription : undefined}
							onSelect={plan.id === "free" ? () => {} : handleSelect}
							isPending={checkout.isPending}
						/>
					))}
				</div>
			</div>
		</QueryBoundary>
	);
}
