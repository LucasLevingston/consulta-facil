"use client";

import { useMemo, useState } from "react";
import { useExamLabs } from "@/hooks/api/exam-labs/use-exam-labs";
import { useExamLabsNearby } from "@/hooks/api/exam-labs/use-exam-labs-nearby";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";
import type {
	LabFilterDerived,
	LabFilterOptions,
	LabFilterState,
	LabFiltersActions,
	LabLocationState,
} from "./use-lab-filters.types";

export type {
	LabFilterDerived,
	LabFilterOptions,
	LabFilterState,
	LabFiltersActions,
	LabLocationState,
} from "./use-lab-filters.types";

export interface UseLabFiltersReturn {
	filterState: LabFilterState;
	location: LabLocationState;
	options: LabFilterOptions;
	derived: LabFilterDerived;
	actions: LabFiltersActions;
	displayed: ReturnType<typeof useExamLabs>["data"] extends infer T
		? T extends unknown[]
			? T
			: never[]
		: never[];
	isLoading: boolean;
	error: unknown;
}

export function useLabFilters(): UseLabFiltersReturn {
	const [search, setSearch] = useState("");
	const [filterState, setFilterState] = useState("");
	const [filterCity, setFilterCity] = useState("");
	const [expanded, setExpanded] = useState(false);
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const [radiusKm, setRadiusKm] = useState(50);

	const isNearbyMode = userLocation !== null;

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
		userLocation?.lat ?? null,
		userLocation?.lng ?? null,
		radiusKm,
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

	function requestLocation() {
		if (!navigator.geolocation) return;
		setLocationLoading(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setUserLocation({
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				});
				setLocationLoading(false);
			},
			() => setLocationLoading(false),
		);
	}

	return {
		filterState: { search, filterState, filterCity, expanded },
		location: { userLocation, locationLoading, radiusKm },
		options: { availableStates, radiusOptions: RADIUS_OPTIONS },
		derived: { totalActive, advancedCount, isNearbyMode },
		actions: {
			setSearch,
			setFilterState,
			setFilterCity,
			setExpanded,
			setRadiusKm,
			clearFilters,
			requestLocation,
			clearLocation: () => setUserLocation(null),
		},
		displayed: displayed as UseLabFiltersReturn["displayed"],
		isLoading,
		error,
	};
}
