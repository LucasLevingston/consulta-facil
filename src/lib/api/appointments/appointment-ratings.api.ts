import { api } from "@/config/api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { RateAppointmentInput } from "@/lib/schemas/appointment/rate-appointment.schema";

export const appointmentRatingsApi = {
	rate: async (
		id: string,
		data: RateAppointmentInput,
	): Promise<AppointmentResponse> => {
		const response = await api.post<AppointmentResponse>(
			`/appointments/${id}/rate`,
			data,
		);
		return response.data;
	},
};
