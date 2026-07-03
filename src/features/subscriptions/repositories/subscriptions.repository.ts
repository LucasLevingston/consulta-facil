import { api } from "@/config/api";
import type { CheckoutResponse } from "@/lib/api/subscriptions/create-checkout.api.types";
import type { SubscriptionResponse } from "@/lib/api/subscriptions/get-my-subscription.api.types";
import type { AdminSubscriptionResponse } from "@/lib/api/subscriptions/subscriptions.api.types";

export const subscriptionsRepository = {
	getMy: async (): Promise<SubscriptionResponse | null> => {
		const res = await api.get<SubscriptionResponse>("/subscriptions/me");
		if (res.status === 204) return null;
		return res.data;
	},

	createCheckout: async (planId: string): Promise<CheckoutResponse> => {
		const res = await api.post<CheckoutResponse>("/subscriptions/checkout", {
			planId,
		});
		return res.data;
	},

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
