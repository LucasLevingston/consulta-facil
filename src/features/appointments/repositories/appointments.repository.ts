import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { CreateAppointmentInput } from "@/lib/schemas/appointment/create-appointment.schema";
import type { RescheduleAppointmentInput } from "@/lib/schemas/appointment/reschedule-appointment.schema";
import type { ApiPage } from "@/lib/schemas/professional/api-page.schema";

export const appointmentsRepository = {
	schedule: (data: CreateAppointmentInput): Promise<AppointmentResponse> =>
		appointmentsCrudApi.schedule(data),

	getById: (id: string): Promise<AppointmentResponse> =>
		appointmentsCrudApi.getById(id),

	getByPatient: (
		userId: string,
		page = 0,
		size = 50,
	): Promise<ApiPage<AppointmentResponse>> =>
		appointmentsCrudApi.getByPatient(userId, page, size),

	getByProfessional: (
		professionalId: string,
		page = 0,
		size = 50,
	): Promise<ApiPage<AppointmentResponse>> =>
		appointmentsCrudApi.getByProfessional(professionalId, page, size),

	getAll: (page = 0, size = 100): Promise<ApiPage<AppointmentResponse>> =>
		appointmentsCrudApi.getAll(page, size),

	delete: (id: string): Promise<void> => appointmentsCrudApi.delete(id),

	reschedule: (
		id: string,
		data: RescheduleAppointmentInput,
	): Promise<AppointmentResponse> => appointmentsCrudApi.reschedule(id, data),
};
