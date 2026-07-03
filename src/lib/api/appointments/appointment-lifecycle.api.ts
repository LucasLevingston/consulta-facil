import { api } from "@/config/api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { CancelAppointmentInput } from "@/lib/schemas/appointment/cancel-appointment.schema";
import type { SetModalityInput } from "@/lib/schemas/appointment/set-modality.schema";

export const appointmentLifecycleApi = {
	confirm: async (id: string): Promise<AppointmentResponse> => {
		const response = await api.put<AppointmentResponse>(
			`/appointments/${id}/confirm`,
		);
		return response.data;
	},

	cancel: async (
		id: string,
		data: CancelAppointmentInput,
	): Promise<AppointmentResponse> => {
		const response = await api.put<AppointmentResponse>(
			`/appointments/${id}/cancel`,
			data,
		);
		return response.data;
	},

	complete: async (id: string): Promise<AppointmentResponse> => {
		const response = await api.put<AppointmentResponse>(
			`/appointments/${id}/complete`,
		);
		return response.data;
	},

	setModality: async (
		id: string,
		data: SetModalityInput,
	): Promise<AppointmentResponse> => {
		const response = await api.put<AppointmentResponse>(
			`/appointments/${id}/modality`,
			data,
		);
		return response.data;
	},
};
