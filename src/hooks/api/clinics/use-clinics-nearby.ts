"use client";

import { useQuery } from "@tanstack/react-query";

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useClinicsNearby(lat: number | null, lng: number | null, radiusKm = 50) {
	return useQuery({
		queryKey: clinicKeys.nearby(lat ?? 0, lng ?? 0, radiusKm),
		queryFn: () => clinicsCrudApi.getNearby(lat ?? 0, lng ?? 0, radiusKm),
		enabled: lat !== null && lng !== null,
	});
}
