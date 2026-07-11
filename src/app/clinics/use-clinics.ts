"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { clinicKeys } from "@/components/clinic/hooks";
import { clinicsRepository } from "@/features/clinics";

export function useClinics() {
	return useSuspenseQuery({
		queryKey: clinicKeys.list(),
		queryFn: () => clinicsRepository.getAll(),
	});
}
