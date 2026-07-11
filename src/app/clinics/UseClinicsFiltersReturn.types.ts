import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";
import type { ClinicsFilterDerived } from "./ClinicsFilterDerived.types";
import type { ClinicsFilterOptions } from "./ClinicsFilterOptions.types";
import type { ClinicsFilterState } from "./ClinicsFilterState.types";
import type { ClinicsFiltersActions } from "./ClinicsFiltersActions.types";
import type { ClinicsLocationState } from "./ClinicsLocationState.types";

export interface UseClinicsFiltersReturn {
	filterState: ClinicsFilterState;
	location: ClinicsLocationState;
	options: ClinicsFilterOptions;
	derived: ClinicsFilterDerived;
	actions: ClinicsFiltersActions;
	displayed: ClinicResponse[];
	isLoading: boolean;
	error: unknown;
}
