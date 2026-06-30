import type { ProfessionalResponse } from "@/features/professionals";

export interface DoctorCardProps {
	doctor: ProfessionalResponse;
	isActiveAppointmentButton?: boolean;
}
