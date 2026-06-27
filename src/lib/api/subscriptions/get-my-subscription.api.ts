import { api } from "@/config/api";
import type { SubscriptionResponse } from "./get-my-subscription.api.types";

export type {
	SubscriptionResponse,
	SubscriptionStatus,
} from "./get-my-subscription.api.types";

export async function getMySubscriptionApi(): Promise<SubscriptionResponse | null> {
	const response = await api.get<SubscriptionResponse>("/subscriptions/me");
	if (response.status === 204) return null;
	return response.data;
}
