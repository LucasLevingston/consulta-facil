interface ClinicsAdvancedFilters {
	filterCity: string;
	filterSpecialty: string;
	filterProfession: string;
	hasSelectedDays: boolean;
	search: string;
	filterState: string;
	isNearbyMode: boolean;
}

export function computeClinicsFilterDerived(filters: ClinicsAdvancedFilters) {
	const advancedCount = [
		filters.filterCity,
		filters.filterSpecialty,
		filters.filterProfession,
		filters.hasSelectedDays,
	].filter(Boolean).length;
	const totalActive =
		[filters.search, filters.filterState].filter(Boolean).length +
		advancedCount;
	return { totalActive, advancedCount, isNearbyMode: filters.isNearbyMode };
}
