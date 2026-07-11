"use client";

import { useQuery } from "@tanstack/react-query";
import { clinicKeys } from "@/components/clinic/hooks";
import { clinicsRepository } from "@/features/clinics";

export function useClinicReceptionists(clinicId: string) {
	return useQuery({
		queryKey: clinicKeys.receptionists(clinicId),
		queryFn: () => clinicsRepository.getReceptionists(clinicId),
		enabled: !!clinicId,
	});
}
