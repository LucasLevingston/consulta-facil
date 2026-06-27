import { api } from "@/config/api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

export const clinicQueueApi = {
	getQueue: async (clinicId: string): Promise<AppointmentResponse[]> => {
		const response = await api.get<AppointmentResponse[]>(
			`/clinics/${clinicId}/queue`,
		);
		return response.data;
	},
};
