import type { DependentResponse } from "@/lib/schemas/dependent/dependent-response.schema";

export const dependentsService = {
	canDelete: (dependent: DependentResponse): boolean => {
		return !!dependent.id;
	},

	getDisplayName: (dependent: DependentResponse): string => {
		return dependent.name ?? "Dependente";
	},

	isEditing: (
		current: DependentResponse | null,
		target: DependentResponse,
	): boolean => {
		return current?.id === target.id;
	},
};
