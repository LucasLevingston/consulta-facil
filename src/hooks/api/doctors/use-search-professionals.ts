"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import { professionalKeys } from "./professional-keys";

export function useSearchProfessionals(specialty: string) {
	return useQuery({
		queryKey: professionalKeys.search(specialty),
		queryFn: () => professionalsApi.searchBySpecialty(specialty),
		enabled: !!specialty,
	});
}
