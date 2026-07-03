"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsRepository } from "../repositories/professionals.repository";
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
			professionalsRepository.getAll(
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
