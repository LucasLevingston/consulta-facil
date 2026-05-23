import { api } from "@/config/api";
import type { NotificationResponse } from "@/lib/schemas/notification.schema";

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

	acceptInvite: async (id: string): Promise<NotificationResponse> => {
		const response = await api.put<NotificationResponse>(
			`/notifications/${id}/accept`,
		);
		return response.data;
	},

	declineInvite: async (id: string): Promise<NotificationResponse> => {
		const response = await api.put<NotificationResponse>(
			`/notifications/${id}/decline`,
		);
		return response.data;
	},

	sendClinicInvite: async (
		clinicId: string,
		professionalProfileId: string,
	): Promise<void> => {
		await api.post(`/clinics/${clinicId}/invites/${professionalProfileId}`);
	},
};
