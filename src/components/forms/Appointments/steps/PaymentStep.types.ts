import type { Control } from "react-hook-form";
import type { AppointmentFormValues } from "@/lib/schemas/appointment/appointment-form.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

export interface PaymentStepProps {
	control: Control<AppointmentFormValues>;
	selectedProfessional: ProfessionalResponse;
}
