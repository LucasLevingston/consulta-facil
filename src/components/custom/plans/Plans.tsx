"use client";

import { useCreateCheckout } from "@/hooks/api/subscriptions/use-create-checkout";
import { useMySubscription } from "@/hooks/api/subscriptions/use-my-subscription";
import { toast } from "@/hooks/use-toast";
import { QueryBoundary } from "@/providers/query-boundary";

import { PLANS } from "./constants";
import { PlanCard } from "./plan-card";
import { SubscriptionBanner } from "./subscription-banner";

export default function Plans() {
  const { data: subscription, isLoading, error } = useMySubscription();
  const checkout = useCreateCheckout();

  function handleSelect(planId: string) {
    checkout.mutate(planId, {
      onError: () =>
        toast({ title: "Erro ao iniciar checkout.", variant: "destructive" }),
    });
  }

  return (
    <QueryBoundary isLoading={isLoading} error={error}>
      {subscription && subscription.status !== "EXPIRED" && (
        <SubscriptionBanner subscription={subscription} />
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground">Escolha um plano</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Planos para médicos usarem a plataforma Consulta Fácil.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
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
