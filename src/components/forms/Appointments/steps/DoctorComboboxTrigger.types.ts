import type { ProfessionalResponse } from "@/features/professionals";

export interface DoctorComboboxTriggerProps {
	selected: ProfessionalResponse | null | undefined;
	open: boolean;
	disabled: boolean;
	hasValue: boolean;
}
