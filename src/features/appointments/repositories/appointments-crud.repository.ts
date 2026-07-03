import { appointmentLifecycleApi } from "@/lib/api/appointments/appointment-lifecycle.api";
import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { CancelAppointmentInput } from "@/lib/schemas/appointment/cancel-appointment.schema";
import type { CreateAppointmentInput } from "@/lib/schemas/appointment/create-appointment.schema";
import type { RescheduleAppointmentInput } from "@/lib/schemas/appointment/reschedule-appointment.schema";
import type { SetModalityInput } from "@/lib/schemas/appointment/set-modality.schema";
import type { ApiPage } from "@/lib/schemas/doctor/api-page.schema";

export const appointmentsCrudRepo = {
	schedule: async (
		data: CreateAppointmentInput,
	): Promise<AppointmentResponse> => appointmentsCrudApi.schedule(data),

	getById: async (id: string): Promise<AppointmentResponse> =>
		appointmentsCrudApi.getById(id),

	getByPatient: async (
		userId: string,
		page = 0,
		size = 50,
	): Promise<ApiPage<AppointmentResponse>> =>
		appointmentsCrudApi.getByPatient(userId, page, size),

	getByProfessional: async (
		professionalId: string,
		page = 0,
		size = 50,
	): Promise<ApiPage<AppointmentResponse>> =>
		appointmentsCrudApi.getByProfessional(professionalId, page, size),

	getAll: async (page = 0, size = 100): Promise<ApiPage<AppointmentResponse>> =>
		appointmentsCrudApi.getAll(page, size),

	delete: async (id: string): Promise<void> => appointmentsCrudApi.delete(id),

	reschedule: async (
		id: string,
		data: RescheduleAppointmentInput,
	): Promise<AppointmentResponse> => appointmentsCrudApi.reschedule(id, data),

	confirm: async (id: string): Promise<AppointmentResponse> =>
		appointmentLifecycleApi.confirm(id),

	cancel: async (
		id: string,
		data: CancelAppointmentInput,
	): Promise<AppointmentResponse> => appointmentLifecycleApi.cancel(id, data),

	complete: async (id: string): Promise<AppointmentResponse> =>
		appointmentLifecycleApi.complete(id),

	setModality: async (
		id: string,
		data: SetModalityInput,
	): Promise<AppointmentResponse> =>
		appointmentLifecycleApi.setModality(id, data),
};
