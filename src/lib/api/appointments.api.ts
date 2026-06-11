import { api } from "@/config/api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { CancelAppointmentInput } from "@/lib/schemas/appointment/cancel-appointment.schema";
import type { CreateAppointmentInput } from "@/lib/schemas/appointment/create-appointment.schema";
import type { PaymentResponse } from "@/lib/schemas/appointment/payment-response.schema";
import type { QrCheckInToken } from "@/lib/schemas/appointment/qr-checkin-token.schema";
import type { RateAppointmentInput } from "@/lib/schemas/appointment/rate-appointment.schema";
import type { RescheduleAppointmentInput } from "@/lib/schemas/appointment/reschedule-appointment.schema";
import type { SetModalityInput } from "@/lib/schemas/appointment/set-modality.schema";
import type { ApiPage } from "@/lib/schemas/doctor/api-page.schema";

export const appointmentsApi = {
	schedule: async (
		data: CreateAppointmentInput,
	): Promise<AppointmentResponse> => {
		const response = await api.post<AppointmentResponse>("/appointments", data);

		return response.data;
	},

	getById: async (id: string): Promise<AppointmentResponse> => {
		const response = await api.get<AppointmentResponse>(`/appointments/${id}`);
		return response.data;
	},

	getByPatient: async (
		userId: string,
		page = 0,
		size = 50,
	): Promise<ApiPage<AppointmentResponse>> => {
		const response = await api.get<ApiPage<AppointmentResponse>>(
			`/appointments/patient/${userId}`,
			{ params: { page, size } },
		);
		return response.data;
	},

	getByProfessional: async (
		professionalId: string,
		page = 0,
		size = 50,
	): Promise<ApiPage<AppointmentResponse>> => {
		const response = await api.get<ApiPage<AppointmentResponse>>(
			`/appointments/professional/${professionalId}`,
			{ params: { page, size } },
		);
		return response.data;
	},

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

	reschedule: async (
		id: string,
		data: RescheduleAppointmentInput,
	): Promise<AppointmentResponse> => {
		const response = await api.put<AppointmentResponse>(
			`/appointments/${id}/reschedule`,
			{ scheduledAt: data.scheduledAt.toISOString(), reason: data.reason },
		);
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await api.delete(`/appointments/${id}`);
	},

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
			{
				params: { token },
			},
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

	generateMeetLink: async (id: string): Promise<AppointmentResponse> => {
		const response = await api.post<AppointmentResponse>(
			`/appointments/${id}/meet-link`,
		);
		return response.data;
	},

	createPayment: async (
		appointmentId: string,
		amount?: number,
	): Promise<PaymentResponse> => {
		const params = amount !== undefined ? { amount } : {};
		const response = await api.post<PaymentResponse>(
			`/appointments/${appointmentId}/payment`,
			null,
			{ params },
		);
		return response.data;
	},

	getAll: async (
		page = 0,
		size = 100,
	): Promise<ApiPage<AppointmentResponse>> => {
		const response = await api.get<ApiPage<AppointmentResponse>>(
			"/appointments",
			{
				params: { page, size },
			},
		);
		return response.data;
	},
};
