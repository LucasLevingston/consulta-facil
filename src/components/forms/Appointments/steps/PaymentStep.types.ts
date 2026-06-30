import type { Control } from "react-hook-form";
import type { AppointmentFormValues } from "@/features/appointments";
import type { ProfessionalResponse } from "@/features/professionals";

export interface PaymentStepProps {
	control: Control<AppointmentFormValues>;
	selectedProfessional: ProfessionalResponse;
}
