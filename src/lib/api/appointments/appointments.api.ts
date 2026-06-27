import { api } from "@/config/api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { CreateAppointmentInput } from "@/lib/schemas/appointment/create-appointment.schema";
import type { RescheduleAppointmentInput } from "@/lib/schemas/appointment/reschedule-appointment.schema";
import type { ApiPage } from "@/lib/schemas/doctor/api-page.schema";

export const appointmentsCrudApi = {
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

	getAll: async (
		page = 0,
		size = 100,
	): Promise<ApiPage<AppointmentResponse>> => {
		const response = await api.get<ApiPage<AppointmentResponse>>(
			"/appointments",
			{ params: { page, size } },
		);
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await api.delete(`/appointments/${id}`);
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
};
