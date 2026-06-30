import type { ProfessionalResponse } from "@/features/professionals";

export interface DoctorOptionProps {
	doctor: ProfessionalResponse;
	isSelected: boolean;
	onSelect: () => void;
}
