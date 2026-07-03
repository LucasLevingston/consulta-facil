"use client";

import { useQuery } from "@tanstack/react-query";

import { clinicQueueApi } from "@/lib/api/clinics/clinic-queue.api";
import { clinicKeys } from "./clinic-keys";

export function useClinicQueue(clinicId: string) {
	return useQuery({
		queryKey: clinicKeys.queue(clinicId),
		queryFn: () => clinicQueueApi.getQueue(clinicId),
		enabled: !!clinicId,
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
