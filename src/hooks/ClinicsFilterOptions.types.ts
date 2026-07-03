import type { RADIUS_OPTIONS } from "@/utils/constants/radius-options";

export interface ClinicsFilterOptions {
	availableStates: string[];
	availableSpecialties: string[];
	availableProfessions: string[];
	radiusOptions: typeof RADIUS_OPTIONS;
}
