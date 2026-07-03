import type { AppointmentResponse } from "@/features/appointments";

export interface QueueCardProps {
	professionalName: string;
	specialty?: string | null;
	appointments: AppointmentResponse[];
}
