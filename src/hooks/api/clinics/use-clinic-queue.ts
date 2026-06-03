"use client";

import { useQuery } from "@tanstack/react-query";

import { clinicsApi } from "@/lib/api/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useClinicQueue(clinicId: string) {
	return useQuery({
		queryKey: clinicKeys.queue(clinicId),
		queryFn: () => clinicsApi.getQueue(clinicId),
		enabled: !!clinicId,
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
