"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { clinicKeys } from "@/components/clinic/hooks";
import { clinicsRepository } from "@/features/clinics";

export function useClinicQueue(clinicId: string) {
	return useSuspenseQuery({
		queryKey: clinicKeys.queue(clinicId),
		queryFn: () => clinicsRepository.getQueue(clinicId),
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
