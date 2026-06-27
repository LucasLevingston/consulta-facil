import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

export interface DoctorCardProps {
	doctor: ProfessionalResponse;
	isActiveAppointmentButton?: boolean;
}
