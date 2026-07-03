import { anamnesisApi } from "@/lib/api/anamnesis/anamnesis.api";
import { appointmentCheckinApi } from "@/lib/api/appointments/appointment-checkin.api";
import { appointmentPaymentApi } from "@/lib/api/appointments/appointment-payment.api";
import { appointmentRatingsApi } from "@/lib/api/appointments/appointment-ratings.api";
import { appointmentVideoApi } from "@/lib/api/appointments/appointment-video.api";
import type { AnamnesisInput } from "@/lib/schemas/anamnesis/anamnesis.schema";
import type { AnamnesisResponse } from "@/lib/schemas/anamnesis/anamnesis-response.schema";
import type { ProntuarioInput } from "@/lib/schemas/anamnesis/prontuario.schema";
import type { ProntuarioResponse } from "@/lib/schemas/anamnesis/prontuario-response.schema";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { PaymentResponse } from "@/lib/schemas/appointment/payment-response.schema";
import type { QrCheckInToken } from "@/lib/schemas/appointment/qr-checkin-token.schema";
import type { RateAppointmentInput } from "@/lib/schemas/appointment/rate-appointment.schema";

export const appointmentsClinicalRepo = {
	getCheckInToken: async (appointmentId: string): Promise<QrCheckInToken> =>
		appointmentCheckinApi.getCheckInToken(appointmentId),

	checkInByQr: async (token: string): Promise<AppointmentResponse> =>
		appointmentCheckinApi.checkInByQr(token),

	getQueue: async (): Promise<AppointmentResponse[]> =>
		appointmentCheckinApi.getQueue(),

	callPatient: async (appointmentId: string): Promise<AppointmentResponse> =>
		appointmentCheckinApi.callPatient(appointmentId),

	createPayment: async (
		appointmentId: string,
		amount?: number,
	): Promise<PaymentResponse> =>
		appointmentPaymentApi.createPayment(appointmentId, amount),

	rate: async (
		id: string,
		data: RateAppointmentInput,
	): Promise<AppointmentResponse> => appointmentRatingsApi.rate(id, data),

	generateMeetLink: async (id: string): Promise<AppointmentResponse> =>
		appointmentVideoApi.generateMeetLink(id),

	getAnamnesis: async (
		appointmentId: string,
	): Promise<AnamnesisResponse | null> =>
		anamnesisApi.getAnamnesis(appointmentId),

	saveAnamnesis: async (
		appointmentId: string,
		data: AnamnesisInput,
	): Promise<AnamnesisResponse> =>
		anamnesisApi.saveAnamnesis(appointmentId, data),

	getProntuario: async (
		appointmentId: string,
	): Promise<ProntuarioResponse | null> =>
		anamnesisApi.getProntuario(appointmentId),

	saveProntuario: async (
		appointmentId: string,
		data: ProntuarioInput,
	): Promise<ProntuarioResponse> =>
		anamnesisApi.saveProntuario(appointmentId, data),
};
