"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";
import { professionalKeys } from "./professional-keys";

export function useProfessionals(
	page = 0,
	size = 12,
	profession?: string,
	specialty?: string,
	name?: string,
	serviceTitle?: string,
) {
	return useQuery({
		queryKey: professionalKeys.list(page, size, profession, specialty, name, serviceTitle),
		queryFn: () =>
			professionalsListingApi.getAll(page, size, profession, specialty, name, serviceTitle),
		staleTime: 1000 * 60 * 5,
	});
}
