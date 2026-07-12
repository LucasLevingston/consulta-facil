export { anamnesisRepository } from "@/features/appointments/repositories/anamnesis.repository";
export { appointmentCheckinRepository } from "@/features/appointments/repositories/appointment-checkin.repository";
export { appointmentLifecycleRepository } from "@/features/appointments/repositories/appointment-lifecycle.repository";
export { appointmentPaymentRepository } from "@/features/appointments/repositories/appointment-payment.repository";
export { appointmentRatingsRepository } from "@/features/appointments/repositories/appointment-ratings.repository";
export { appointmentVideoRepository } from "@/features/appointments/repositories/appointment-video.repository";
export { appointmentsRepository } from "@/features/appointments/repositories/appointments.repository";
export type { AnamnesisInput } from "@/lib/schemas/anamnesis/anamnesis.schema";
export type { AnamnesisResponse } from "@/lib/schemas/anamnesis/anamnesis-response.schema";
export type { ProntuarioInput } from "@/lib/schemas/anamnesis/prontuario.schema";
export type { ProntuarioResponse } from "@/lib/schemas/anamnesis/prontuario-response.schema";
export {
	type AppointmentFormValues,
	appointmentFormSchema,
} from "@/lib/schemas/appointment/appointment-form.schema";
export type { AppointmentPaymentStatus } from "@/lib/schemas/appointment/appointment-payment-status.schema";
export type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
export type { AppointmentStatus } from "@/lib/schemas/appointment/appointment-status.schema";
export {
	type CancelAppointmentInput,
	cancelAppointmentSchema,
} from "@/lib/schemas/appointment/cancel-appointment.schema";
export {
	type RescheduleAppointmentInput,
	rescheduleAppointmentSchema,
} from "@/lib/schemas/appointment/reschedule-appointment.schema";
export type {
	AnamnesisMessage,
	VoiceBookingResult,
} from "@/lib/types/ai";
