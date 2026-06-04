import { api } from "@/config/api";

export type SubscriptionStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface SubscriptionResponse {
	id: string;
	planId: string;
	status: SubscriptionStatus;
	expiresAt: string | null;
	createdAt: string;
}

export async function getMySubscriptionApi(): Promise<SubscriptionResponse | null> {
	const response = await api.get<SubscriptionResponse>("/subscriptions/me");
	if (response.status === 204) return null;
	return response.data;
}
