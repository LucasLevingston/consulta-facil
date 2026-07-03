import { api } from "@/config/api";
import type { NotificationResponse } from "@/lib/schemas/notification/notification.schema";

export const notificationsRepository = {
	getAll: async (): Promise<NotificationResponse[]> => {
		const res = await api.get<NotificationResponse[]>("/notifications/me");
		return res.data;
	},

	getUnreadCount: async (): Promise<number> => {
		const res = await api.get<{ count: number }>(
			"/notifications/me/unread-count",
		);
		return res.data.count;
	},

	markAsRead: async (id: string): Promise<NotificationResponse> => {
		const res = await api.put<NotificationResponse>(
			`/notifications/${id}/read`,
		);
		return res.data;
	},

	markAllAsRead: async (): Promise<void> => {
		await api.put("/notifications/read-all");
	},

	acceptInvite: async (id: string): Promise<NotificationResponse> => {
		const res = await api.put<NotificationResponse>(
			`/notifications/${id}/accept`,
		);
		return res.data;
	},

	declineInvite: async (id: string): Promise<NotificationResponse> => {
		const res = await api.put<NotificationResponse>(
			`/notifications/${id}/decline`,
		);
		return res.data;
	},

	sendClinicInvite: async (
		clinicId: string,
		professionalProfileId: string,
	): Promise<void> => {
		await api.post(`/clinics/${clinicId}/invites/${professionalProfileId}`);
	},
};
