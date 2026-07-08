"use client";

import { useMemo, useState } from "react";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";
import type { UseLabFiltersReturn } from "./UseLabFiltersReturn.types";
import { useExamLabs } from "./use-exam-labs";
import { useExamLabsNearby } from "./use-exam-labs-nearby";
import { useLabLocation } from "./use-lab-location";

export type { LabFilterDerived } from "./LabFilterDerived.types";
export type { LabFilterOptions } from "./LabFilterOptions.types";
export type { LabFilterState } from "./LabFilterState.types";
export type { LabFiltersActions } from "./LabFiltersActions.types";
export type { LabLocationState } from "./LabLocationState.types";
export type { UseLabFiltersReturn } from "./UseLabFiltersReturn.types";

export function useLabFilters(): UseLabFiltersReturn {
	const [search, setSearch] = useState("");
	const [filterState, setFilterState] = useState("");
	const [filterCity, setFilterCity] = useState("");
	const [expanded, setExpanded] = useState(false);

	const loc = useLabLocation();
	const isNearbyMode = loc.userLocation !== null;

	const {
		data: allLabs = [],
		isLoading: allLoading,
		error: allError,
	} = useExamLabs();
	const {
		data: nearbyLabs = [],
		isLoading: nearbyLoading,
		error: nearbyError,
	} = useExamLabsNearby(
		loc.userLocation?.lat ?? null,
		loc.userLocation?.lng ?? null,
		loc.radiusKm,
	);

	const isLoading = isNearbyMode ? nearbyLoading : allLoading;
	const error = isNearbyMode ? nearbyError : allError;

	const availableStates = useMemo(
		() =>
			[...new Set(allLabs.flatMap((l) => (l.state ? [l.state] : [])))].sort(),
		[allLabs],
	);

	const baseList = isNearbyMode ? nearbyLabs : allLabs;

	const displayed = useMemo(() => {
		let result = baseList;
		if (search.trim())
			result = result.filter(
				(l) =>
					l.name.toLowerCase().includes(search.toLowerCase()) ||
					l.acceptedExams?.some((e) =>
						e.toLowerCase().includes(search.toLowerCase()),
					),
			);
		if (filterState) result = result.filter((l) => l.state === filterState);
		if (filterCity)
			result = result.filter((l) =>
				l.city?.toLowerCase().includes(filterCity.toLowerCase()),
			);
		return result;
	}, [baseList, search, filterState, filterCity]);

	const totalActive = [search, filterState, filterCity].filter(Boolean).length;
	const advancedCount = [filterCity].filter(Boolean).length;

	function clearFilters() {
		setSearch("");
		setFilterState("");
		setFilterCity("");
	}

	return {
		filterState: { search, filterState, filterCity, expanded },
		location: loc,
		options: { availableStates, radiusOptions: RADIUS_OPTIONS },
		derived: { totalActive, advancedCount, isNearbyMode },
		actions: {
			setSearch,
			setFilterState,
			setFilterCity,
			setExpanded,
			setRadiusKm: loc.setRadiusKm,
			clearFilters,
			requestLocation: loc.requestLocation,
			clearLocation: loc.clearLocation,
		},
		displayed,
		isLoading,
		error,
	};
}
