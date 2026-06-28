"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";
import { professionalKeys } from "./professional-keys";

export function useSearchProfessionals(specialty: string) {
	return useQuery({
		queryKey: professionalKeys.search(specialty),
		queryFn: () => professionalsListingApi.searchBySpecialty(specialty),
		enabled: !!specialty,
	});
}
