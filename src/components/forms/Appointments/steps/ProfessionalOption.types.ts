import type { ProfessionalResponse } from "@/features/professionals";

export interface ProfessionalOptionProps {
	professional: ProfessionalResponse;
	isSelected: boolean;
	onSelect: () => void;
}
