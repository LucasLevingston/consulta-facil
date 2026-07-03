import type { ProfessionalResponse } from "@/features/professionals";

export interface ProfessionalComboboxTriggerProps {
	selected: ProfessionalResponse | null | undefined;
	open: boolean;
	disabled: boolean;
	hasValue: boolean;
}
