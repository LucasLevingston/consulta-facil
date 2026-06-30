import type { DependentResponse } from "@/features/dependents";

export interface DependentCardProps {
	dependent: DependentResponse;
	onEdit: (dep: DependentResponse) => void;
	onDelete: (id: string) => void;
	deleting: boolean;
}
