"use client";

import { useQuery } from "@tanstack/react-query";

import { clinicsApi } from "@/lib/api/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useClinicReceptionists(clinicId: string) {
	return useQuery({
		queryKey: clinicKeys.receptionists(clinicId),
		queryFn: () => clinicsApi.getReceptionists(clinicId),
		enabled: !!clinicId,
	});
}
