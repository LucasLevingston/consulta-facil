import type { RADIUS_OPTIONS } from "@/utils/constants/radius-options";

export interface LabFilterState {
	search: string;
	filterState: string;
	filterCity: string;
	expanded: boolean;
}

export interface LabLocationState {
	userLocation: { lat: number; lng: number } | null;
	locationLoading: boolean;
	radiusKm: number;
}

export interface LabFilterOptions {
	availableStates: string[];
	radiusOptions: typeof RADIUS_OPTIONS;
}

export interface LabFilterDerived {
	totalActive: number;
	advancedCount: number;
	isNearbyMode: boolean;
}

export interface LabFiltersActions {
	setSearch: (v: string) => void;
	setFilterState: (v: string) => void;
	setFilterCity: (v: string) => void;
	setExpanded: (v: boolean) => void;
	setRadiusKm: (v: number) => void;
	clearFilters: () => void;
	requestLocation: () => void;
	clearLocation: () => void;
}
