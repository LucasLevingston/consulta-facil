"use client";

import { useMemo, useState } from "react";
import { useClinics } from "@/hooks/api/clinics/use-clinics";
import { useClinicsNearby } from "@/hooks/api/clinics/use-clinics-nearby";
import type { DayKey } from "@/utils/constants/days-of-week";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";
import type {
	ClinicsFilterDerived,
	ClinicsFilterOptions,
	ClinicsFilterState,
	ClinicsFiltersActions,
	ClinicsLocationState,
	ClinicsViewMode,
} from "./use-clinics-filters.types";

export type {
	ClinicsFilterDerived,
	ClinicsFilterOptions,
	ClinicsFilterState,
	ClinicsFiltersActions,
	ClinicsLocationState,
	ClinicsViewMode,
} from "./use-clinics-filters.types";

export interface UseClinicsFiltersReturn {
	filterState: ClinicsFilterState;
	location: ClinicsLocationState;
	options: ClinicsFilterOptions;
	derived: ClinicsFilterDerived;
	actions: ClinicsFiltersActions;
	displayed: ReturnType<typeof useClinics>["data"] extends infer T
		? T extends unknown[]
			? T
			: never[]
		: never[];
	isLoading: boolean;
	error: unknown;
}

export function useClinicsFilters(): UseClinicsFiltersReturn {
	const [viewMode, setViewMode] = useState<ClinicsViewMode>("list");
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const [radiusKm, setRadiusKm] = useState(50);

	const [search, setSearch] = useState("");
	const [filterState, setFilterState] = useState("");
	const [filterCity, setFilterCity] = useState("");
	const [filterSpecialty, setFilterSpecialty] = useState("");
	const [filterProfession, setFilterProfession] = useState("");
	const [selectedDays, setSelectedDays] = useState<DayKey[]>([]);
	const [expanded, setExpanded] = useState(false);

	const isNearbyMode = userLocation !== null;

	const {
		data: allClinics = [],
		isLoading: allLoading,
		error: allError,
	} = useClinics();

	const {
		data: nearbyClinics = [],
		isLoading: nearbyLoading,
		error: nearbyError,
	} = useClinicsNearby(
		userLocation?.lat ?? null,
		userLocation?.lng ?? null,
		radiusKm,
	);

	const isLoading = isNearbyMode ? nearbyLoading : allLoading;
	const error = isNearbyMode ? nearbyError : allError;

	const availableStates = useMemo(
		() =>
			[
				...new Set(allClinics.flatMap((c) => (c.state ? [c.state] : []))),
			].sort(),
		[allClinics],
	);

	const availableSpecialties = useMemo(
		() =>
			[
				...new Set(
					allClinics.flatMap((c) => c.members?.map((m) => m.specialty) ?? []),
				),
			].sort(),
		[allClinics],
	);

	const availableProfessions = useMemo(
		() =>
			[
				...new Set(
					allClinics.flatMap((c) => c.members?.map((m) => m.role) ?? []),
				),
			].sort(),
		[allClinics],
	);

	const baseList = isNearbyMode ? nearbyClinics : allClinics;

	const displayed = useMemo(() => {
		let result = baseList;
		if (search.trim())
			result = result.filter((c) =>
				c.name.toLowerCase().includes(search.toLowerCase()),
			);
		if (filterState) result = result.filter((c) => c.state === filterState);
		if (filterCity)
			result = result.filter((c) =>
				c.city?.toLowerCase().includes(filterCity.toLowerCase()),
			);
		if (filterSpecialty)
			result = result.filter((c) =>
				c.members?.some((m) => m.specialty === filterSpecialty),
			);
		if (filterProfession)
			result = result.filter((c) =>
				c.members?.some((m) => m.role === filterProfession),
			);
		return result;
	}, [
		baseList,
		search,
		filterState,
		filterCity,
		filterSpecialty,
		filterProfession,
	]);

	const advancedCount = [
		filterCity,
		filterSpecialty,
		filterProfession,
		selectedDays.length > 0,
	].filter(Boolean).length;
	const totalActive =
		[search, filterState].filter(Boolean).length + advancedCount;

	function clearFilters() {
		setSearch("");
		setFilterState("");
		setFilterCity("");
		setFilterSpecialty("");
		setFilterProfession("");
		setSelectedDays([]);
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
				setViewMode("map");
				setLocationLoading(false);
			},
			() => setLocationLoading(false),
		);
	}

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
		location: { userLocation, locationLoading, radiusKm },
		options: {
			availableStates,
			availableSpecialties,
			availableProfessions,
			radiusOptions: RADIUS_OPTIONS,
		},
		derived: { totalActive, advancedCount, isNearbyMode },
		actions: {
			setSearch,
			setFilterState,
			setFilterCity,
			setFilterSpecialty,
			setFilterProfession,
			setSelectedDays,
			setExpanded,
			setViewMode,
			setRadiusKm,
			clearFilters,
			requestLocation,
			clearLocation: () => setUserLocation(null),
		},
		displayed: displayed as UseClinicsFiltersReturn["displayed"],
		isLoading,
		error,
	};
}
