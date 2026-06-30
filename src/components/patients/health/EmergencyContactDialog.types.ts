import type { EmergencyContactInput } from "@/features/patients";

export type ContactItem = EmergencyContactInput & { id?: string };

export interface EmergencyContactDialogProps {
	open: boolean;
	onClose: () => void;
	editing?: ContactItem;
}
