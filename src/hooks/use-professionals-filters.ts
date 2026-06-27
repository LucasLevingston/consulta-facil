"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useProfessionals } from "@/hooks/api/doctors/use-professionals";
import { useProfessionalsNearby } from "@/hooks/api/doctors/use-professionals-nearby";
import { ITEMS_PER_PAGE } from "@/utils/constants/pagination";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";
import type {
	ProfessionalsFiltersActions,
	ProfessionalsLocationState,
	ProfessionalsViewMode,
} from "./use-professionals-filters.types";

export type {
	ProfessionalsFiltersActions,
	ProfessionalsLocationState,
	ProfessionalsViewMode,
} from "./use-professionals-filters.types";

export interface UseProfessionalsFiltersReturn {
	viewMode: ProfessionalsViewMode;
	location: ProfessionalsLocationState;
	actions: ProfessionalsFiltersActions;
	displayed: ReturnType<typeof useProfessionals>["data"] extends infer T
		? T extends { content: infer C }
			? C
			: never[]
		: never[];
	professionalsWithLocation: UseProfessionalsFiltersReturn["displayed"];
	totalElements: number;
	totalPages: number;
	currentPage: number;
	isNearbyMode: boolean;
	isLoading: boolean;
	error: unknown;
	radiusOptions: typeof RADIUS_OPTIONS;
}

export function useProfessionalsFilters(): UseProfessionalsFiltersReturn {
	const router = useRouter();
	const searchParams = useSearchParams();

	const name = searchParams.get("name") ?? "";
	const profession = searchParams.get("profession") ?? "";
	const specialty = searchParams.get("specialty") ?? "";
	const serviceTitle = searchParams.get("serviceTitle") ?? "";
	const state = searchParams.get("state") ?? "";
	const page = Number(searchParams.get("page") ?? "0");

	const [viewMode, setViewMode] = useState<ProfessionalsViewMode>("list");
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const [radiusKm, setRadiusKm] = useState(50);

	const isNearbyMode = userLocation !== null;

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
		userLocation?.lat ?? null,
		userLocation?.lng ?? null,
		radiusKm,
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

	function goToPage(p: number) {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", String(p));
		router.replace(`/professionals?${params.toString()}`);
	}

	return {
		viewMode,
		location: { userLocation, locationLoading, radiusKm },
		actions: {
			setViewMode,
			setRadiusKm,
			requestLocation,
			clearLocation: () => setUserLocation(null),
			goToPage,
		},
		displayed: displayed as UseProfessionalsFiltersReturn["displayed"],
		professionalsWithLocation:
			professionalsWithLocation as UseProfessionalsFiltersReturn["displayed"],
		totalElements,
		totalPages,
		currentPage: page,
		isNearbyMode,
		isLoading,
		error,
		radiusOptions: RADIUS_OPTIONS,
	};
}
