import type { ProfessionalResponse } from "@/features/professionals";

export interface ProfessionalCardProps {
	professional: ProfessionalResponse;
	isActiveAppointmentButton?: boolean;
}
