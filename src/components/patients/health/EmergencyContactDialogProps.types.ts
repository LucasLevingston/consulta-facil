import type { ContactItem } from "./ContactItem.types";

export interface EmergencyContactDialogProps {
	open: boolean;
	onClose: () => void;
	editing?: ContactItem;
}
