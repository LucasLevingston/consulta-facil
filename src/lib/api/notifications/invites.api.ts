import { api } from "@/config/api";
import type { NotificationResponse } from "@/lib/schemas/notification/notification.schema";

export const invitesApi = {
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
