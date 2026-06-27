import type { DayKey } from "@/utils/constants/days-of-week";
import type { RADIUS_OPTIONS } from "@/utils/constants/radius-options";

export type ClinicsViewMode = "list" | "map";

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

export interface ClinicsLocationState {
	userLocation: { lat: number; lng: number } | null;
	locationLoading: boolean;
	radiusKm: number;
}

export interface ClinicsFilterOptions {
	availableStates: string[];
	availableSpecialties: string[];
	availableProfessions: string[];
	radiusOptions: typeof RADIUS_OPTIONS;
}

export interface ClinicsFilterDerived {
	totalActive: number;
	advancedCount: number;
	isNearbyMode: boolean;
}

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
