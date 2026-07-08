import { invitesApi } from "@/lib/api/notifications/invites.api";
import { notificationsApi } from "@/lib/api/notifications/notifications.api";
import type { NotificationResponse } from "@/lib/schemas/notification/notification.schema";

export const notificationsRepository = {
	getAll: (): Promise<NotificationResponse[]> => notificationsApi.getAll(),

	getUnreadCount: (): Promise<number> => notificationsApi.getUnreadCount(),

	markAsRead: (id: string): Promise<NotificationResponse> =>
		notificationsApi.markAsRead(id),

	markAllAsRead: (): Promise<void> => notificationsApi.markAllAsRead(),

	acceptInvite: (id: string): Promise<NotificationResponse> =>
		invitesApi.acceptInvite(id),

	declineInvite: (id: string): Promise<NotificationResponse> =>
		invitesApi.declineInvite(id),

	sendClinicInvite: (
		clinicId: string,
		professionalProfileId: string,
	): Promise<void> =>
		invitesApi.sendClinicInvite(clinicId, professionalProfileId),
};
