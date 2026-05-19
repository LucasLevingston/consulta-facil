"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { SubscriptionResponse } from "@/lib/api/subscriptions/get-my-subscription.api";
import { cn } from "@/lib/utils";

import type { Plan } from "./types";

interface PlanCardProps {
  plan: Plan;
  subscription: SubscriptionResponse | null | undefined;
  onSelect: (planId: string) => void;
  isPending: boolean;
}

export function PlanCard({ plan, subscription, onSelect, isPending }: PlanCardProps) {
  const isActive =
    subscription?.status === "ACTIVE" && subscription.planId === plan.id;

  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between transition-all duration-200",
        plan.highlight ? "border-primary shadow-lg shadow-primary/10" : "border-border",
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
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
            <span className="text-foreground">{feature}</span>
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
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assinar agora
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
