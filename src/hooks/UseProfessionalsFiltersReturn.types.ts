import type { ProfessionalResponse } from "@/lib/schemas/professional/professional-response.schema";
import type { RADIUS_OPTIONS } from "@/utils/constants/radius-options";
import type { ProfessionalsFiltersActions } from "./ProfessionalsFiltersActions.types";
import type { ProfessionalsLocationState } from "./ProfessionalsLocationState.types";
import type { ProfessionalsViewMode } from "./ProfessionalsViewMode.types";

export interface UseProfessionalsFiltersReturn {
	viewMode: ProfessionalsViewMode;
	location: ProfessionalsLocationState;
	actions: ProfessionalsFiltersActions;
	displayed: ProfessionalResponse[];
	professionalsWithLocation: ProfessionalResponse[];
	totalElements: number;
	totalPages: number;
	currentPage: number;
	isNearbyMode: boolean;
	isLoading: boolean;
	error: unknown;
	radiusOptions: typeof RADIUS_OPTIONS;
}
