"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { professionalsListingRepository } from "../repositories/professionals-listing.repository";
import { professionalKeys } from "./professional-keys";

export function useProfessionalRatings(professionalId: string) {
	return useSuspenseQuery({
		queryKey: professionalKeys.ratings(professionalId),
		queryFn: () => professionalsListingRepository.getRatings(professionalId),
	});
}
