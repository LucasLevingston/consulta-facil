import { api } from "@/config/api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

export const appointmentVideoApi = {
	generateMeetLink: async (id: string): Promise<AppointmentResponse> => {
		const response = await api.post<AppointmentResponse>(
			`/appointments/${id}/meet-link`,
		);
		return response.data;
	},
};
