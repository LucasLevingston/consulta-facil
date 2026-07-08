import { appointmentLifecycleApi } from "@/lib/api/appointments/appointment-lifecycle.api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { CancelAppointmentInput } from "@/lib/schemas/appointment/cancel-appointment.schema";
import type { SetModalityInput } from "@/lib/schemas/appointment/set-modality.schema";

export const appointmentLifecycleRepository = {
	confirm: (id: string): Promise<AppointmentResponse> =>
		appointmentLifecycleApi.confirm(id),

	cancel: (
		id: string,
		data: CancelAppointmentInput,
	): Promise<AppointmentResponse> => appointmentLifecycleApi.cancel(id, data),

	complete: (id: string): Promise<AppointmentResponse> =>
		appointmentLifecycleApi.complete(id),

	setModality: (
		id: string,
		data: SetModalityInput,
	): Promise<AppointmentResponse> =>
		appointmentLifecycleApi.setModality(id, data),
};
