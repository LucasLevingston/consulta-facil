export type ProfessionalsViewMode = "list" | "map";

export interface ProfessionalsLocationState {
	userLocation: { lat: number; lng: number } | null;
	locationLoading: boolean;
	radiusKm: number;
}

export interface ProfessionalsFiltersActions {
	setViewMode: (v: ProfessionalsViewMode) => void;
	setRadiusKm: (v: number) => void;
	requestLocation: () => void;
	clearLocation: () => void;
	goToPage: (p: number) => void;
}
