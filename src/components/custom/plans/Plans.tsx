"use client";

import { BadgeCheck, Building2, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import {
	useCreateCheckout,
	useMySubscription,
} from "@/components/custom/plans/hooks";
import type { PlanResponse } from "@/features/plans";
import { usePlans } from "@/features/plans";
import { PRO_PLAN_IDS } from "../../../utils/constants/pro-plan-ids";
import { apiPlanToUiPlan } from "./Plans.utils";
import { PlanCard } from "./plan-card";
import { SubscriptionBanner } from "./subscription-banner";

const TIER_ICONS: Record<string, React.ReactNode> = {
	FREE: <BadgeCheck className="h-5 w-5" />,
	STARTER: <Zap className="h-5 w-5" />,
	PRO: <Sparkles className="h-5 w-5" />,
	CLINIC: <Building2 className="h-5 w-5" />,
};

export default function Plans() {
	const { data: plansData } = usePlans();
	const { data: subscription } = useMySubscription();
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

	const plans = plansData
		.sort((a, b) => a.displayOrder - b.displayOrder)
		.map((p: PlanResponse) =>
			apiPlanToUiPlan(p, TIER_ICONS[p.tier] ?? <Zap className="h-5 w-5" />),
		);

	return (
		<>
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
		</>
	);
}
