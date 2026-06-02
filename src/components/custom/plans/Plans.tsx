"use client";

import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateCheckout } from "@/hooks/api/subscriptions/use-create-checkout";
import { useMySubscription } from "@/hooks/api/subscriptions/use-my-subscription";
import { QueryBoundary } from "@/providers/query-boundary";

import ClinicPlans from "./ClinicPlans";
import { PLANS } from "./constants";
import { PlanCard } from "./plan-card";
import { SubscriptionBanner } from "./subscription-banner";

const PRO_PLAN_IDS = new Set(["monthly", "yearly"]);

export default function Plans() {
	const { data: subscription, isLoading, error } = useMySubscription();
	const checkout = useCreateCheckout();

	function handleSelect(planId: string) {
		checkout.mutate(planId, {
			onError: () => toast.error("Erro ao iniciar checkout."),
		});
	}

	const hasProSubscription =
		subscription &&
		subscription.status === "ACTIVE" &&
		PRO_PLAN_IDS.has(subscription.planId);

	const defaultTab = subscription?.planId?.startsWith("clinic")
		? "clinic"
		: "professional";

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			{/* Active plan banner — show regardless of tab */}
			{subscription && subscription.status !== "EXPIRED" && (
				<SubscriptionBanner subscription={subscription} />
			)}

			<Tabs defaultValue={defaultTab} className="space-y-6">
				<TabsList className="w-full sm:w-auto">
					<TabsTrigger value="professional" className="flex-1 sm:flex-none">
						Profissional
					</TabsTrigger>
					<TabsTrigger value="clinic" className="flex-1 sm:flex-none">
						Clínica
					</TabsTrigger>
				</TabsList>

				<TabsContent value="professional" className="space-y-6 mt-0">
					<div>
						<h2 className="text-lg font-semibold text-foreground">
							Planos Pro
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Para profissionais de saúde que usam a plataforma individualmente.
						</p>
					</div>

					<div className="grid gap-6 sm:grid-cols-2">
						{PLANS.map((plan) => (
							<PlanCard
								key={plan.id}
								plan={plan}
								subscription={hasProSubscription ? subscription : undefined}
								onSelect={handleSelect}
								isPending={checkout.isPending}
							/>
						))}
					</div>
				</TabsContent>

				<TabsContent value="clinic" className="mt-0">
					<ClinicPlans />
				</TabsContent>
			</Tabs>
		</QueryBoundary>
	);
}
