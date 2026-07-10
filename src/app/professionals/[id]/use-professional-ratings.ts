"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalsListingRepository } from "@/features/professionals";

export function useProfessionalRatings(professionalId: string) {
	return useSuspenseQuery({
		queryKey: professionalKeys.ratings(professionalId),
		queryFn: () => professionalsListingRepository.getRatings(professionalId),
	});
}
