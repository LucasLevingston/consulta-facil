"use client";

import { Building2, Crown } from "lucide-react";
import { toast } from "sonner";

import { useCreateCheckout } from "@/hooks/api/subscriptions/use-create-checkout";
import { useMySubscription } from "@/hooks/api/subscriptions/use-my-subscription";
import { QueryBoundary } from "@/providers/query-boundary";

import { PlanCard } from "./plan-card";
import { SubscriptionBanner } from "./subscription-banner";
import type { Plan } from "./types";

const CLINIC_PLANS: Plan[] = [
  {
    id: "clinic-monthly",
    title: "Clínica Mensal",
    monthlyEquiv: "149,90",
    totalPrice: "149,90",
    period: "/mês",
    description: "Gerencie sua clínica com múltiplos médicos e visibilidade no mapa.",
    icon: <Building2 className="h-5 w-5" />,
    features: [
      "Perfil de clínica no mapa",
      "Múltiplos médicos por clínica",
      "Filtro por localização",
      "Badge de clínica verificada",
    ],
  },
  {
    id: "clinic-yearly",
    title: "Clínica Anual",
    monthlyEquiv: "124,99",
    totalPrice: "1.499,90",
    period: "/ano",
    description: "Economize 17% pagando anualmente.",
    icon: <Crown className="h-5 w-5" />,
    highlight: true,
    features: [
      "Tudo do plano mensal",
      "Economia de R$ 298,90/ano",
      "Destaque nos resultados de busca",
      "Relatórios de agendamentos",
    ],
  },
];

export default function ClinicPlans() {
  const { data: subscription, isLoading, error } = useMySubscription();
  const checkout = useCreateCheckout();

  function handleSelect(planId: string) {
    checkout.mutate(planId, {
      onError: () => toast.error("Erro ao iniciar checkout."),
    });
  }

  return (
    <QueryBoundary isLoading={isLoading} error={error}>
      {subscription &&
        subscription.status !== "EXPIRED" &&
        (subscription.planId === "clinic-monthly" || subscription.planId === "clinic-yearly") && (
          <SubscriptionBanner subscription={subscription} />
        )}

      <div>
        <h2 className="text-lg font-semibold text-foreground">Planos para clínicas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ideal para clínicas com múltiplos profissionais e localização no mapa.
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
