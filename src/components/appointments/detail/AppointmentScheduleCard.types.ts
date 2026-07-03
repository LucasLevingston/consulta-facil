import type { AppointmentResponse } from "@/features/appointments";
import type { VideoRoom } from "@/features/video";

export interface AppointmentScheduleCardProps {
	appointment: AppointmentResponse;
	isPatient: boolean;
	isProfessional: boolean;
	userId: string | undefined;
	canReschedule: boolean;
	videoRoom: VideoRoom | undefined;
	onVideoStart: (appointmentId: string) => void;
}
