"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalsListingRepository } from "@/features/professionals";

export function useProfessionalsNearby(
	lat: number | null,
	lng: number | null,
	radiusKm = 50,
	specialty?: string,
	profession?: string,
) {
	return useQuery({
		queryKey: professionalKeys.nearby(
			lat ?? 0,
			lng ?? 0,
			radiusKm,
			specialty,
			profession,
		),
		queryFn: () =>
			professionalsListingRepository.getNearby(
				lat ?? 0,
				lng ?? 0,
				radiusKm,
				specialty,
				profession,
			),
		enabled: lat !== null && lng !== null,
		staleTime: 1000 * 60 * 5,
	});
}
