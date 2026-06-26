import { api } from "@/config/api";
import type { SubscriptionResponse } from "./get-my-subscription.api";

export interface AdminSubscriptionResponse extends SubscriptionResponse {
	userId: string;
	userEmail: string;
	planName: string;
	ownerType: "DOCTOR" | "CLINIC" | "LABORATORY";
}

export const subscriptionsApi = {
	adminListAll: async (): Promise<AdminSubscriptionResponse[]> => {
		const res = await api.get<AdminSubscriptionResponse[]>(
			"/admin/subscriptions",
		);
		return res.data;
	},

	adminCancel: async (id: string): Promise<void> => {
		await api.patch(`/admin/subscriptions/${id}/cancel`);
	},
};
