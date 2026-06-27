import { api } from "@/config/api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { QrCheckInToken } from "@/lib/schemas/appointment/qr-checkin-token.schema";

export const appointmentCheckinApi = {
	getCheckInToken: async (appointmentId: string): Promise<QrCheckInToken> => {
		const response = await api.get<QrCheckInToken>(
			`/appointments/${appointmentId}/checkin-token`,
		);
		return response.data;
	},

	checkInByQr: async (token: string): Promise<AppointmentResponse> => {
		const response = await api.post<AppointmentResponse>(
			"/appointments/checkin",
			null,
			{ params: { token } },
		);
		return response.data;
	},

	getQueue: async (): Promise<AppointmentResponse[]> => {
		const response = await api.get<AppointmentResponse[]>(
			"/appointments/queue",
		);
		return response.data;
	},

	callPatient: async (appointmentId: string): Promise<AppointmentResponse> => {
		const response = await api.put<AppointmentResponse>(
			`/appointments/${appointmentId}/call`,
		);
		return response.data;
	},
};
