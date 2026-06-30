import type { Control } from "react-hook-form";
import type { AppointmentFormValues } from "@/features/appointments";

export interface ModalityStepProps {
	control: Control<AppointmentFormValues>;
}
