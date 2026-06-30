import type { AppointmentResponse } from "@/features/appointments";

export interface AppointmentModalProps {
	appointment?: AppointmentResponse;
	type: "schedule" | "cancel";
	title: string;
	description: string;
}
