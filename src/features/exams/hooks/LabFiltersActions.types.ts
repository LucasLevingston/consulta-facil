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
