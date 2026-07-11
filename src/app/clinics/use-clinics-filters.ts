"use client";

import { useMemo, useState } from "react";
import type { DayKey } from "@/utils/constants/days-of-week";
import { buildClinicsFilterActions } from "./build-clinics-filter-actions";
import type { ClinicsViewMode } from "./ClinicsViewMode.types";
import { computeClinicsFilterDerived } from "./compute-clinics-filter-derived";
import { filterClinicsList } from "./filter-clinics-list";
import type { UseClinicsFiltersReturn } from "./UseClinicsFiltersReturn.types";
import { useClinicFilterOptions } from "./use-clinic-filter-options";
import { useClinicsListSource } from "./use-clinics-list-source";
import { useClinicsLocation } from "./use-clinics-location";

export type { UseClinicsFiltersReturn } from "./UseClinicsFiltersReturn.types";

export function useClinicsFilters(): UseClinicsFiltersReturn {
	const [viewMode, setViewMode] = useState<ClinicsViewMode>("list");
	const [search, setSearch] = useState("");
	const [filterState, setFilterState] = useState("");
	const [filterCity, setFilterCity] = useState("");
	const [filterSpecialty, setFilterSpecialty] = useState("");
	const [filterProfession, setFilterProfession] = useState("");
	const [selectedDays, setSelectedDays] = useState<DayKey[]>([]);
	const [expanded, setExpanded] = useState(false);
	const loc = useClinicsLocation();
	const { isNearbyMode, allClinics, baseList, isLoading, error } =
		useClinicsListSource(loc);
	const options = useClinicFilterOptions(allClinics);

	const displayed = useMemo(
		() =>
			filterClinicsList(baseList, {
				search,
				filterState,
				filterCity,
				filterSpecialty,
				filterProfession,
			}),
		[
			baseList,
			search,
			filterState,
			filterCity,
			filterSpecialty,
			filterProfession,
		],
	);

	const derived = computeClinicsFilterDerived({
		filterCity,
		filterSpecialty,
		filterProfession,
		hasSelectedDays: selectedDays.length > 0,
		search,
		filterState,
		isNearbyMode,
	});

	return {
		filterState: {
			search,
			filterState,
			filterCity,
			filterSpecialty,
			filterProfession,
			selectedDays,
			expanded,
			viewMode,
		},
		location: loc,
		options,
		derived,
		actions: buildClinicsFilterActions({
			setSearch,
			setFilterState,
			setFilterCity,
			setFilterSpecialty,
			setFilterProfession,
			setSelectedDays,
			setExpanded,
			setViewMode,
			setRadiusKm: loc.setRadiusKm,
			requestLocation: loc.requestLocation,
			clearLocation: loc.clearLocation,
		}),
		displayed,
		isLoading,
		error,
	};
}
