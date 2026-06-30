import type { ProfessionalResponse } from "@/features/professionals";

export interface SelectedProfessionalCardProps {
	professional: ProfessionalResponse;
	showClear: boolean;
	onClear: () => void;
}
