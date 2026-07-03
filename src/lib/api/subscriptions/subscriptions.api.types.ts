import type { SubscriptionResponse } from "./get-my-subscription.api.types";

export interface AdminSubscriptionResponse extends SubscriptionResponse {
	userId: string;
	userEmail: string;
	planName: string;
	ownerType: "PROFESSIONAL" | "CLINIC" | "LABORATORY";
}
