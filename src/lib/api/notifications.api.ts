export { invitesApi } from "./invites.api";

import { api } from "@/config/api";
import type { NotificationResponse } from "@/lib/schemas/notification/notification.schema";
import { invitesApi } from "./invites.api";

export const notificationsApi = {
	getAll: async (): Promise<NotificationResponse[]> => {
		const response = await api.get<NotificationResponse[]>("/notifications/me");
		return response.data;
	},

	getUnreadCount: async (): Promise<number> => {
		const response = await api.get<{ count: number }>(
			"/notifications/me/unread-count",
		);
		return response.data.count;
	},

	markAsRead: async (id: string): Promise<NotificationResponse> => {
		const response = await api.put<NotificationResponse>(
			`/notifications/${id}/read`,
		);
		return response.data;
	},

	markAllAsRead: async (): Promise<void> => {
		await api.put("/notifications/read-all");
	},

	...invitesApi,
};
