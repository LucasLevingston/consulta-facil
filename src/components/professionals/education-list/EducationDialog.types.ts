import type { ProfessionalResponse } from "@/features/professionals";

export type EducationItem = NonNullable<
	ProfessionalResponse["education"]
>[number];

export interface EducationDialogProps {
	open: boolean;
	onClose: () => void;
	editing?: EducationItem;
}
