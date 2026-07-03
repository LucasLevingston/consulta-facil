import type { ProfessionalsViewMode } from "./ProfessionalsViewMode.types";

export interface ProfessionalsFiltersActions {
	setViewMode: (v: ProfessionalsViewMode) => void;
	setRadiusKm: (v: number) => void;
	requestLocation: () => void;
	clearLocation: () => void;
	goToPage: (p: number) => void;
}
