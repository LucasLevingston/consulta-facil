export type SubscriptionStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface SubscriptionResponse {
	id: string;
	planId: string;
	status: SubscriptionStatus;
	expiresAt: string | null;
	createdAt: string;
}
