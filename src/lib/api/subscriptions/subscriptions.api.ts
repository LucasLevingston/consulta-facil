import { api } from "@/config/api";
import type { AdminSubscriptionResponse } from "./subscriptions.api.types";

export type { AdminSubscriptionResponse } from "./subscriptions.api.types";

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
