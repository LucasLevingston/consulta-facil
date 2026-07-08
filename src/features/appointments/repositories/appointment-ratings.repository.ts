import { appointmentRatingsApi } from "@/lib/api/appointments/appointment-ratings.api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { RateAppointmentInput } from "@/lib/schemas/appointment/rate-appointment.schema";

export const appointmentRatingsRepository = {
	rate: (
		id: string,
		data: RateAppointmentInput,
	): Promise<AppointmentResponse> => appointmentRatingsApi.rate(id, data),
};
