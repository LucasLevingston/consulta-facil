"use client";

import { differenceInDays, parseISO } from "date-fns";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PLAN_LABELS } from "@/utils/constants/plan-labels";
import { SubscriptionBannerInfo } from "./SubscriptionBannerInfo";
import { SubscriptionProgressBar } from "./SubscriptionProgressBar";
import { SubscriptionStatusBadges } from "./SubscriptionStatusBadges";
import type { SubscriptionBannerProps } from "./subscription-banner.types";

export function SubscriptionBanner({ subscription }: SubscriptionBannerProps) {
	function getDaysRemaining(expiresAt: string | null): number | null {
		if (!expiresAt) return null;
		return differenceInDays(parseISO(expiresAt), new Date());
	}

	const label = PLAN_LABELS[subscription.planId] ?? subscription.planId;
	const daysRemaining = getDaysRemaining(subscription.expiresAt);
	const isActive = subscription.status === "ACTIVE";
	const isExpiringSoon =
		daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0;

	const expiresAtFormatted = subscription.expiresAt
		? new Date(subscription.expiresAt).toLocaleDateString("pt-BR")
		: null;

	const StatusIcon = isActive
		? isExpiringSoon
			? AlertTriangle
			: CheckCircle2
		: subscription.status === "PENDING"
			? Clock
			: XCircle;

	const progressPercent =
		isActive && daysRemaining !== null
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
				<SubscriptionBannerInfo
					label={label}
					expiresAtFormatted={expiresAtFormatted}
					isActive={isActive}
					isExpiringSoon={isExpiringSoon}
					StatusIcon={StatusIcon}
				/>
				<SubscriptionStatusBadges
					status={subscription.status}
					isExpiringSoon={isExpiringSoon}
					daysRemaining={daysRemaining}
				/>
			</div>
			{isActive && progressPercent !== null && (
				<SubscriptionProgressBar
					progressPercent={progressPercent}
					progressColor={progressColor}
					daysRemaining={daysRemaining}
				/>
			)}
		</div>
	);
}
