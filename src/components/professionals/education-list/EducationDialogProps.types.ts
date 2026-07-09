import type { EducationItem } from "./EducationItem.types";

export interface EducationDialogProps {
	open: boolean;
	onClose: () => void;
	editing?: EducationItem;
}
