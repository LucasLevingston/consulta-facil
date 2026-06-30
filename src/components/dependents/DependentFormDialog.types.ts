import type { DependentResponse } from "@/features/dependents";

export interface DependentFormDialogProps {
	open: boolean;
	onClose: () => void;
	editing?: DependentResponse | null;
}
