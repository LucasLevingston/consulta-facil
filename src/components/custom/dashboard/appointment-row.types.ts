import type { AppointmentResponse } from "@/features/appointments";

export interface AppointmentRowProps {
	appointment: AppointmentResponse;
	isProfessional: boolean;
	onConfirm?: (id: string) => void;
	onComplete?: (id: string) => void;
}
