"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useProfessional(id: string) {
	return useQuery({
		queryKey: professionalKeys.detail(id),
		queryFn: () => professionalsRepository.getById(id),
		enabled: !!id,
	});
}
