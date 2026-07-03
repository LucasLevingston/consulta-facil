import type { SubscriptionResponse } from "@/lib/api/subscriptions/get-my-subscription.api.types";

export const subscriptionService = {
	isActive: (sub: SubscriptionResponse | null | undefined): boolean => {
		return sub?.status === "ACTIVE";
	},

	daysUntilExpiry: (sub: SubscriptionResponse | null | undefined): number => {
		if (!sub?.expiresAt) return 0;
		const diff = new Date(sub.expiresAt).getTime() - Date.now();
		return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
	},

	canUpgrade: (sub: SubscriptionResponse | null | undefined): boolean => {
		return !sub || sub.status !== "ACTIVE";
	},
};
