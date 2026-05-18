"use client";

import { CheckCircle2, Crown, Loader2, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCreateCheckout } from "@/hooks/api/subscriptions/use-create-checkout";
import { useMySubscription } from "@/hooks/api/subscriptions/use-my-subscription";
import { toast } from "@/hooks/use-toast";
import type { SubscriptionResponse } from "@/lib/api/subscriptions/get-my-subscription.api";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  title: string;
  monthlyEquiv: string;
  totalPrice: string;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  icon: React.ReactNode;
}

const PLANS: Plan[] = [
  {
    id: "monthly",
    title: "Pro Mensal",
    monthlyEquiv: "49,90",
    totalPrice: "49,90",
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
    monthlyEquiv: "41,66",
    totalPrice: "499,90",
    period: "/ano",
    description: "Economize 17% pagando anualmente.",
    icon: <Crown className="h-5 w-5" />,
    highlight: true,
    features: [
      "Tudo do plano mensal",
      "Economia de R$ 98,90/ano",
      "Badge de parceiro verificado",
      "Acesso antecipado a novidades",
    ],
  },
];

function PlanCard({
  plan,
  subscription,
  onSelect,
  isPending,
}: {
  plan: Plan;
  subscription: SubscriptionResponse | null | undefined;
  onSelect: (planId: string) => void;
  isPending: boolean;
}) {
  const isActive =
    subscription?.status === "ACTIVE" && subscription.planId === plan.id;

  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between transition-all duration-200",
        plan.highlight
          ? "border-primary shadow-lg shadow-primary/10"
          : "border-border",
      )}
    >
      {plan.highlight && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
          Mais popular
        </Badge>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 text-primary">
          {plan.icon}
          <span className="font-semibold">{plan.title}</span>
        </div>
        <div className="mt-3 flex items-end gap-1">
          <span className="text-3xl font-bold text-foreground">
            R$ {plan.monthlyEquiv}
          </span>
          <span className="mb-1 text-sm text-muted-foreground">/mês</span>
        </div>
        {plan.id === "yearly" && (
          <p className="text-xs text-muted-foreground">
            Cobrado anualmente — R$ {plan.totalPrice}
          </p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
      </CardHeader>

      <CardContent className="space-y-2">
        {plan.features.map((f) => (
          <div key={f} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
            <span className="text-foreground">{f}</span>
          </div>
        ))}
      </CardContent>

      <CardFooter className="pt-4">
        {isActive ? (
          <Button className="w-full" variant="outline" disabled>
            Plano atual
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={plan.highlight ? "default" : "outline"}
            onClick={() => onSelect(plan.id)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Assinar agora
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function CurrentSubscriptionBanner({
  subscription,
}: {
  subscription: SubscriptionResponse;
}) {
  const label = subscription.planId === "yearly" ? "Pro Anual" : "Pro Mensal";
  const expiresAt = subscription.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString("pt-BR")
    : null;

  const statusColor: Record<string, string> = {
    ACTIVE: "bg-green-500/10 text-green-600 border-green-500/30",
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/30",
    EXPIRED: "bg-zinc-500/10 text-zinc-600 border-zinc-500/30",
  };

  const statusLabel: Record<string, string> = {
    ACTIVE: "Ativo",
    PENDING: "Pendente",
    CANCELLED: "Cancelado",
    EXPIRED: "Expirado",
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Plano atual</p>
          <p className="text-lg font-semibold text-foreground">{label}</p>
          {expiresAt && (
            <p className="text-xs text-muted-foreground">Válido até {expiresAt}</p>
          )}
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
            statusColor[subscription.status] ?? statusColor.EXPIRED,
          )}
        >
          {statusLabel[subscription.status] ?? subscription.status}
        </span>
      </div>
    </div>
  );
}

export default function Plans() {
  const { data: subscription, isLoading } = useMySubscription();
  const checkout = useCreateCheckout();

  function handleSelect(planId: string) {
    checkout.mutate(planId, {
      onError: () =>
        toast({ title: "Erro ao iniciar checkout.", variant: "destructive" }),
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {subscription && subscription.status !== "EXPIRED" && (
        <CurrentSubscriptionBanner subscription={subscription} />
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
    </div>
  );
}
