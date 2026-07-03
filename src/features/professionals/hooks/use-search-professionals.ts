"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useSearchProfessionals(specialty: string) {
	return useQuery({
		queryKey: professionalKeys.search(specialty),
		queryFn: () => professionalsRepository.searchBySpecialty(specialty),
		enabled: !!specialty,
	});
}
