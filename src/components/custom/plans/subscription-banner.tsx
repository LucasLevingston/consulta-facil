import type { SubscriptionResponse } from "@/lib/api/subscriptions/get-my-subscription.api";
import { cn } from "@/lib/utils";

import { SUBSCRIPTION_STATUS_COLOR, SUBSCRIPTION_STATUS_LABEL } from "./constants";

interface SubscriptionBannerProps {
  subscription: SubscriptionResponse;
}

export function SubscriptionBanner({ subscription }: SubscriptionBannerProps) {
  const label = subscription.planId === "yearly" ? "Pro Anual" : "Pro Mensal";
  const expiresAt = subscription.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString("pt-BR")
    : null;

  const colorClass =
    SUBSCRIPTION_STATUS_COLOR[subscription.status] ?? SUBSCRIPTION_STATUS_COLOR.EXPIRED;
  const statusLabel =
    SUBSCRIPTION_STATUS_LABEL[subscription.status] ?? subscription.status;

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
            colorClass,
          )}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
}
