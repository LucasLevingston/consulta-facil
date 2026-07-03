"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useProfessionalRatings(professionalId: string) {
	return useQuery({
		queryKey: professionalKeys.ratings(professionalId),
		queryFn: () => professionalsRepository.getRatings(professionalId),
		enabled: !!professionalId,
	});
}
