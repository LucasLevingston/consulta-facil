import type { DayKey } from "@/utils/constants/days-of-week";
import type { ClinicsViewMode } from "./ClinicsViewMode.types";

export interface ClinicsFilterState {
	search: string;
	filterState: string;
	filterCity: string;
	filterSpecialty: string;
	filterProfession: string;
	selectedDays: DayKey[];
	expanded: boolean;
	viewMode: ClinicsViewMode;
}
