"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsListingRepository } from "@/features/professionals";
import { professionalKeys } from "./professional-keys";

export function useSearchProfessionals(specialty: string) {
	return useQuery({
		queryKey: professionalKeys.search(specialty),
		queryFn: () => professionalsListingRepository.searchBySpecialty(specialty),
		enabled: !!specialty,
	});
}
