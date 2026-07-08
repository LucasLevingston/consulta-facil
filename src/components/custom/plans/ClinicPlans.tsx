"use client";

import { toast } from "sonner";
import { useMyClinic } from "@/features/clinics";
import { useCreateCheckout, useMySubscription } from "@/features/subscriptions";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";
import { ClinicFreemiumInfo } from "./ClinicFreemiumInfo";
import { clinicPlans } from "./ClinicPlans.utils";
import { ClinicPriceCalculator } from "./ClinicPriceCalculator";
import { ClinicUsageCard } from "./ClinicUsageCard";
import { PlanCard } from "./plan-card";
import { SubscriptionBanner } from "./subscription-banner";

export default function ClinicPlans() {
	const { data: subscription } = useMySubscription();
	const { data: myClinics } = useMyClinic();
	const checkout = useCreateCheckout();

	const myClinic = myClinics[0] ?? null;
	const currentProfessionals = myClinic?.members?.length ?? 1;

	function handleSelect(planId: string) {
		checkout.mutate(planId, {
			onError: () => toast.error("Erro ao iniciar checkout."),
		});
	}

	return (
		<>
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
				{clinicPlans.map((plan) => (
					<PlanCard
						key={plan.id}
						plan={plan}
						subscription={subscription}
						onSelect={handleSelect}
						isPending={checkout.isPending}
					/>
				))}
			</div>
		</>
	);
}
