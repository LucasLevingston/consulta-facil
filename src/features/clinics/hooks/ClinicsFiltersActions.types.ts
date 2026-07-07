import type { DayKey } from "@/utils/constants/days-of-week";
import type { ClinicsViewMode } from "./ClinicsViewMode.types";

export interface ClinicsFiltersActions {
	setSearch: (v: string) => void;
	setFilterState: (v: string) => void;
	setFilterCity: (v: string) => void;
	setFilterSpecialty: (v: string) => void;
	setFilterProfession: (v: string) => void;
	setSelectedDays: (days: DayKey[]) => void;
	setExpanded: (v: boolean) => void;
	setViewMode: (v: ClinicsViewMode) => void;
	setRadiusKm: (v: number) => void;
	clearFilters: () => void;
	requestLocation: () => void;
	clearLocation: () => void;
}
