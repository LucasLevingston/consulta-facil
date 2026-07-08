"use client";

import { useQuery } from "@tanstack/react-query";
import { clinicsRepository } from "../repositories/clinics.repository";
import { clinicKeys } from "./clinic-keys";

export function useClinicQueue(clinicId: string) {
	return useQuery({
		queryKey: clinicKeys.queue(clinicId),
		queryFn: () => clinicsRepository.getQueue(clinicId),
		enabled: !!clinicId,
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
