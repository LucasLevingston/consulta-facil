import type { Control } from "react-hook-form";
import type { AppointmentFormValues } from "@/lib/schemas/appointment/appointment-form.schema";

export interface ModalityStepProps {
	control: Control<AppointmentFormValues>;
}
