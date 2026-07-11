"use client";

import { useQuery } from "@tanstack/react-query";
import { clinicKeys } from "@/components/clinic/hooks";
import { clinicsRepository } from "@/features/clinics";

export function useClinicQueue(clinicId: string) {
	return useQuery({
		queryKey: clinicKeys.queue(clinicId),
		queryFn: () => clinicsRepository.getQueue(clinicId),
		enabled: !!clinicId,
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
