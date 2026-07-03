import type { Control } from "react-hook-form";
import type { AppointmentFormValues } from "@/features/appointments";
import type { ProfessionalResponse } from "@/features/professionals";

export interface ProfessionalFormFieldProps {
	control: Control<AppointmentFormValues>;
	professionals: ProfessionalResponse[];
	professionalsLoading: boolean;
	professionalIdParam: string | null;
	selectedProfessional: ProfessionalResponse | undefined;
	onProfessionalSelect: () => void;
}
