import type { SubscriptionResponse } from "@/features/subscriptions";
import type { Plan } from "./types";

export interface PlanCardProps {
	plan: Plan;
	subscription: SubscriptionResponse | null | undefined;
	onSelect: (planId: string) => void;
	isPending: boolean;
}
