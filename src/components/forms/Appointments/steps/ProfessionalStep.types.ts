import type { Control } from "react-hook-form";
import type { AppointmentFormValues } from "@/lib/schemas/appointment/appointment-form.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

export interface ProfessionalStepProps {
	control: Control<AppointmentFormValues>;
	professionals: ProfessionalResponse[];
	professionalsLoading: boolean;
	professionalIdParam: string | null;
	selectedProfessional: ProfessionalResponse | undefined;
	initialSpecialtyFilter?: string;
	onDoctorSelect: () => void;
	onDoctorClear: () => void;
}
