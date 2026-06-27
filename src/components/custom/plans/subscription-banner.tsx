"use client";

import { differenceInDays, parseISO } from "date-fns";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { SubscriptionResponse } from "@/lib/api/subscriptions/get-my-subscription.api";
import { cn } from "@/lib/utils/cn";

import { PLAN_LABELS } from "@/utils/constants/plan-labels";
import {
	SUBSCRIPTION_STATUS_COLOR,
	SUBSCRIPTION_STATUS_LABEL,
} from "@/utils/constants/subscription-status";

interface SubscriptionBannerProps {
	subscription: SubscriptionResponse;
}

function getDaysRemaining(expiresAt: string | null): number | null {
	if (!expiresAt) return null;
	return differenceInDays(parseISO(expiresAt), new Date());
}

export function SubscriptionBanner({ subscription }: SubscriptionBannerProps) {
	const label = PLAN_LABELS[subscription.planId] ?? subscription.planId;
	const daysRemaining = getDaysRemaining(subscription.expiresAt);
	const isExpiringSoon =
		daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0;

	const expiresAtFormatted = subscription.expiresAt
		? new Date(subscription.expiresAt).toLocaleDateString("pt-BR")
		: null;

	const StatusIcon =
		subscription.status === "ACTIVE"
			? isExpiringSoon
				? AlertTriangle
				: CheckCircle2
			: subscription.status === "PENDING"
				? Clock
				: XCircle;

	const progressPercent =
		subscription.status === "ACTIVE" && daysRemaining !== null
			? Math.max(0, Math.min(100, (daysRemaining / 365) * 100))
			: null;

	const progressColor =
		daysRemaining !== null && daysRemaining <= 7
			? "bg-red-500"
			: daysRemaining !== null && daysRemaining <= 30
				? "bg-yellow-500"
				: "bg-primary";

	return (
		<div
			className={cn(
				"rounded-2xl border bg-card p-5 space-y-4",
				isExpiringSoon ? "border-yellow-500/40" : "border-border",
			)}
		>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex items-start gap-3">
					<div
						className={cn(
							"mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
							subscription.status === "ACTIVE"
								? isExpiringSoon
									? "bg-yellow-500/10"
									: "bg-green-500/10"
								: "bg-muted",
						)}
					>
						<StatusIcon
							className={cn(
								"h-4 w-4",
								subscription.status === "ACTIVE"
									? isExpiringSoon
										? "text-yellow-500"
										: "text-green-500"
									: "text-muted-foreground",
							)}
						/>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Plano atual</p>
						<p className="font-semibold text-foreground">{label}</p>
						{expiresAtFormatted && (
							<p className="mt-0.5 text-xs text-muted-foreground">
								{subscription.status === "ACTIVE" ? "Válido até" : "Expirou em"}{" "}
								{expiresAtFormatted}
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Badge
						variant="outline"
						className={cn(
							"text-xs font-semibold",
							SUBSCRIPTION_STATUS_COLOR[subscription.status] ??
								SUBSCRIPTION_STATUS_COLOR.EXPIRED,
						)}
					>
						{SUBSCRIPTION_STATUS_LABEL[subscription.status] ??
							subscription.status}
					</Badge>

					{isExpiringSoon && daysRemaining !== null && (
						<Badge
							variant="outline"
							className="text-xs font-semibold border-yellow-500/30 bg-yellow-500/10 text-yellow-600"
						>
							Expira em{" "}
							{daysRemaining === 0
								? "hoje"
								: `${daysRemaining} dia${daysRemaining !== 1 ? "s" : ""}`}
						</Badge>
					)}
				</div>
			</div>

			{subscription.status === "ACTIVE" && progressPercent !== null && (
				<div className="space-y-1.5">
					<div className="h-1.5 overflow-hidden rounded-full bg-muted">
						<div
							className={cn(
								"h-full rounded-full transition-all",
								progressColor,
							)}
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
					{daysRemaining !== null && (
						<p className="text-xs text-muted-foreground text-right">
							{daysRemaining} dia{daysRemaining !== 1 ? "s" : ""} restante
							{daysRemaining !== 1 ? "s" : ""}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
