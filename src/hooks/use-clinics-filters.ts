"use client";

import { useMemo, useState } from "react";
import { useClinics } from "@/hooks/api/clinics/use-clinics";
import { useClinicsNearby } from "@/hooks/api/clinics/use-clinics-nearby";
import type { DayKey } from "@/utils/constants/days-of-week";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";
import type { ClinicsFilterDerived } from "./ClinicsFilterDerived.types";
import type { ClinicsFilterOptions } from "./ClinicsFilterOptions.types";
import type { ClinicsFilterState } from "./ClinicsFilterState.types";
import type { ClinicsFiltersActions } from "./ClinicsFiltersActions.types";
import type { ClinicsLocationState } from "./ClinicsLocationState.types";
import type { ClinicsViewMode } from "./ClinicsViewMode.types";
import { useClinicsLocation } from "./use-clinics-location";

export type { ClinicsFilterDerived } from "./ClinicsFilterDerived.types";
export type { ClinicsFilterOptions } from "./ClinicsFilterOptions.types";
export type { ClinicsFilterState } from "./ClinicsFilterState.types";
export type { ClinicsFiltersActions } from "./ClinicsFiltersActions.types";
export type { ClinicsLocationState } from "./ClinicsLocationState.types";
export type { ClinicsViewMode } from "./ClinicsViewMode.types";

export interface UseClinicsFiltersReturn {
	filterState: ClinicsFilterState;
	location: ClinicsLocationState;
	options: ClinicsFilterOptions;
	derived: ClinicsFilterDerived;
	actions: ClinicsFiltersActions;
	displayed: NonNullable<ReturnType<typeof useClinics>["data"]>;
	isLoading: boolean;
	error: unknown;
}

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
	const isNearbyMode = loc.userLocation !== null;

	const { data: allClinics = [], isLoading: allLoading, error: allError } = useClinics();
	const {
		data: nearbyClinics = [],
		isLoading: nearbyLoading,
		error: nearbyError,
	} = useClinicsNearby(loc.userLocation?.lat ?? null, loc.userLocation?.lng ?? null, loc.radiusKm);

	const isLoading = isNearbyMode ? nearbyLoading : allLoading;
	const error = isNearbyMode ? nearbyError : allError;
	const baseList = isNearbyMode ? nearbyClinics : allClinics;

	const { availableStates, availableSpecialties, availableProfessions } = useMemo(
		() => ({
			availableStates: [...new Set(allClinics.flatMap((c) => (c.state ? [c.state] : [])))].sort(),
			availableSpecialties: [
				...new Set(allClinics.flatMap((c) => c.members?.map((m) => m.specialty) ?? [])),
			].sort(),
			availableProfessions: [
				...new Set(allClinics.flatMap((c) => c.members?.map((m) => m.role) ?? [])),
			].sort(),
		}),
		[allClinics],
	);

	const displayed = useMemo(() => {
		let r = baseList;
		if (search.trim()) r = r.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
		if (filterState) r = r.filter((c) => c.state === filterState);
		if (filterCity) r = r.filter((c) => c.city?.toLowerCase().includes(filterCity.toLowerCase()));
		if (filterSpecialty)
			r = r.filter((c) => c.members?.some((m) => m.specialty === filterSpecialty));
		if (filterProfession) r = r.filter((c) => c.members?.some((m) => m.role === filterProfession));
		return r;
	}, [baseList, search, filterState, filterCity, filterSpecialty, filterProfession]);

	const advancedCount = [
		filterCity,
		filterSpecialty,
		filterProfession,
		selectedDays.length > 0,
	].filter(Boolean).length;
	const totalActive = [search, filterState].filter(Boolean).length + advancedCount;

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
			setRadiusKm: loc.setRadiusKm,
			clearFilters: () => {
				setSearch("");
				setFilterState("");
				setFilterCity("");
				setFilterSpecialty("");
				setFilterProfession("");
				setSelectedDays([]);
			},
			requestLocation: () => loc.requestLocation(() => setViewMode("map")),
			clearLocation: loc.clearLocation,
		},
		displayed,
		isLoading,
		error,
	};
}
