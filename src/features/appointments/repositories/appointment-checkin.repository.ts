import { appointmentCheckinApi } from "@/lib/api/appointments/appointment-checkin.api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { QrCheckInToken } from "@/lib/schemas/appointment/qr-checkin-token.schema";

export const appointmentCheckinRepository = {
	getCheckInToken: (appointmentId: string): Promise<QrCheckInToken> =>
		appointmentCheckinApi.getCheckInToken(appointmentId),

	checkInByQr: (token: string): Promise<AppointmentResponse> =>
		appointmentCheckinApi.checkInByQr(token),

	getQueue: (): Promise<AppointmentResponse[]> =>
		appointmentCheckinApi.getQueue(),

	callPatient: (appointmentId: string): Promise<AppointmentResponse> =>
		appointmentCheckinApi.callPatient(appointmentId),
};
