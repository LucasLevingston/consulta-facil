import type { ExamLabResponse } from "@/lib/schemas/examLab/exam-lab-response.schema";
import type { LabFilterDerived } from "./LabFilterDerived.types";
import type { LabFilterOptions } from "./LabFilterOptions.types";
import type { LabFilterState } from "./LabFilterState.types";
import type { LabFiltersActions } from "./LabFiltersActions.types";
import type { LabLocationState } from "./LabLocationState.types";

export interface UseLabFiltersReturn {
	filterState: LabFilterState;
	location: LabLocationState;
	options: LabFilterOptions;
	derived: LabFilterDerived;
	actions: LabFiltersActions;
	displayed: ExamLabResponse[];
	isLoading: boolean;
	error: unknown;
}
