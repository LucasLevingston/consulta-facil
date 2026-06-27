import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

export interface AppointmentRowProps {
	appointment: AppointmentResponse;
	isProfessional: boolean;
	onConfirm?: (id: string) => void;
	onComplete?: (id: string) => void;
}
