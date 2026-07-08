"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { professionalsListingRepository } from "../repositories/professionals-listing.repository";
import { professionalKeys } from "./professional-keys";

export function useProfessional(id: string) {
	return useSuspenseQuery({
		queryKey: professionalKeys.detail(id),
		queryFn: () => professionalsListingRepository.getById(id),
	});
}
