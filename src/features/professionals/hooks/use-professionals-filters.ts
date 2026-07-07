"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useProfessionals } from "@/hooks/api/professionals/use-professionals";
import { useProfessionalsNearby } from "@/hooks/api/professionals/use-professionals-nearby";
import { ITEMS_PER_PAGE } from "@/utils/constants/pagination";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";
import type { UseProfessionalsFiltersReturn } from "./UseProfessionalsFiltersReturn.types";
import { useProfessionalsLocation } from "./use-professionals-location";

export type { ProfessionalsFiltersActions } from "./ProfessionalsFiltersActions.types";
export type { ProfessionalsLocationState } from "./ProfessionalsLocationState.types";
export type { ProfessionalsViewMode } from "./ProfessionalsViewMode.types";
export type { UseProfessionalsFiltersReturn } from "./UseProfessionalsFiltersReturn.types";

export function useProfessionalsFilters(): UseProfessionalsFiltersReturn {
	const router = useRouter();
	const searchParams = useSearchParams();
	const name = searchParams.get("name") ?? "";
	const profession = searchParams.get("profession") ?? "";
	const specialty = searchParams.get("specialty") ?? "";
	const serviceTitle = searchParams.get("serviceTitle") ?? "";
	const state = searchParams.get("state") ?? "";
	const page = Number(searchParams.get("page") ?? "0");

	const loc = useProfessionalsLocation();
	const isNearbyMode = loc.userLocation !== null;

	const {
		data: pageData,
		isLoading: listLoading,
		error: listError,
	} = useProfessionals(
		page,
		ITEMS_PER_PAGE,
		profession,
		specialty,
		name,
		serviceTitle,
	);
	const {
		data: nearbyRaw = [],
		isLoading: nearbyLoading,
		error: nearbyError,
	} = useProfessionalsNearby(
		loc.userLocation?.lat ?? null,
		loc.userLocation?.lng ?? null,
		loc.radiusKm,
		specialty || undefined,
		profession || undefined,
	);

	const isLoading = isNearbyMode ? nearbyLoading : listLoading;
	const error = isNearbyMode ? nearbyError : listError;

	const displayed = useMemo(() => {
		let base = isNearbyMode ? nearbyRaw : (pageData?.content ?? []);
		if (state) base = base.filter((p) => p.state === state);
		return base;
	}, [isNearbyMode, nearbyRaw, pageData, state]);

	const totalPages = pageData?.totalPages ?? 1;
	const totalElements = isNearbyMode
		? displayed.length
		: state
			? displayed.length
			: (pageData?.totalElements ?? 0);
	const professionalsWithLocation = displayed.filter(
		(d) => d.latitude != null && d.longitude != null,
	);

	function goToPage(p: number) {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", String(p));
		router.replace(`/professionals?${params.toString()}`);
	}

	return {
		viewMode: loc.viewMode,
		location: loc,
		actions: {
			setViewMode: loc.setViewMode,
			setRadiusKm: loc.setRadiusKm,
			requestLocation: loc.requestLocation,
			clearLocation: loc.clearLocation,
			goToPage,
		},
		displayed,
		professionalsWithLocation,
		totalElements,
		totalPages,
		currentPage: page,
		isNearbyMode,
		isLoading,
		error,
		radiusOptions: RADIUS_OPTIONS,
	};
}
