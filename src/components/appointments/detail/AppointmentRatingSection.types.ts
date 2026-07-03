import type { AppointmentResponse } from "@/features/appointments";

export interface AppointmentRatingSectionProps {
	appointment: AppointmentResponse;
	canRate: boolean;
}
