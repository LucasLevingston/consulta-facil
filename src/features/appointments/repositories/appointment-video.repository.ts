import { appointmentVideoApi } from "@/lib/api/appointments/appointment-video.api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

export const appointmentVideoRepository = {
	generateMeetLink: (id: string): Promise<AppointmentResponse> =>
		appointmentVideoApi.generateMeetLink(id),
};
