"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsListingRepository } from "../repositories/professionals-listing.repository";
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
		queryKey: professionalKeys.list(
			page,
			size,
			profession,
			specialty,
			name,
			serviceTitle,
		),
		queryFn: () =>
			professionalsListingRepository.getAll(
				page,
				size,
				profession,
				specialty,
				name,
				serviceTitle,
			),
		staleTime: 1000 * 60 * 5,
	});
}
