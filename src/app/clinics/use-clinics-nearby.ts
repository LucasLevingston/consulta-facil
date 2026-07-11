"use client";

import { useQuery } from "@tanstack/react-query";
import { clinicKeys } from "@/components/clinic/hooks";
import { clinicsRepository } from "@/features/clinics";

export function useClinicsNearby(
	lat: number | null,
	lng: number | null,
	radiusKm = 50,
) {
	return useQuery({
		queryKey: clinicKeys.nearby(lat ?? 0, lng ?? 0, radiusKm),
		queryFn: () => clinicsRepository.getNearby(lat ?? 0, lng ?? 0, radiusKm),
		enabled: lat !== null && lng !== null,
	});
}
