import type { UseAppointmentFormSetupReturn } from "@/features/appointments/hooks/use-appointment-form-setup";

export interface ProfessionalStepProps {
	hook: UseAppointmentFormSetupReturn;
	initialSpecialtyFilter?: string;
}
