"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalsListingRepository } from "@/features/professionals";

export function useProfessional(id: string) {
	return useSuspenseQuery({
		queryKey: professionalKeys.detail(id),
		queryFn: () => professionalsListingRepository.getById(id),
	});
}
