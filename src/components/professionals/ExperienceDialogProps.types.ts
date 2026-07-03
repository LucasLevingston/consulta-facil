import type { ExperienceItem } from "./ExperienceItem.types";

export interface ExperienceDialogProps {
	open: boolean;
	onClose: () => void;
	editing?: ExperienceItem;
}
