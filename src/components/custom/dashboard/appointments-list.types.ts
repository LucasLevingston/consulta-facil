import type { AppointmentResponse } from "@/features/appointments";

export interface AppointmentsListProps {
	appointments: AppointmentResponse[];
	isProfessional: boolean;
	onConfirm?: (id: string) => void;
	onComplete?: (id: string) => void;
}
