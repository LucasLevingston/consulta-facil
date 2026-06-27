import type { SubscriptionResponse } from "@/lib/api/subscriptions/get-my-subscription.api";
import type { Plan } from "./types";

export interface PlanCardProps {
	plan: Plan;
	subscription: SubscriptionResponse | null | undefined;
	onSelect: (planId: string) => void;
	isPending: boolean;
}
