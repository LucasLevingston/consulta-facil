import type { ProfessionalResponse } from "@/features/professionals";

export type ExperienceItem = NonNullable<
	ProfessionalResponse["experience"]
>[number];

export interface ExperienceDialogProps {
	open: boolean;
	onClose: () => void;
	editing?: ExperienceItem;
}
