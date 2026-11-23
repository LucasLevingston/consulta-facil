"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { clinicKeys } from "@/components/clinic/hooks";
import { clinicsRepository } from "@/features/clinics";

export function useClinicsNearby(lat: number, lng: number, radiusKm = 50) {
	return useSuspenseQuery({
		queryKey: clinicKeys.nearby(lat, lng, radiusKm),
		queryFn: () => clinicsRepository.getNearby(lat, lng, radiusKm),
	});
}
