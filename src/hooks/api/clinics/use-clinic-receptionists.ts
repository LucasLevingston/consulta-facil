"use client";

import { useQuery } from "@tanstack/react-query";

import { clinicStaffApi } from "@/lib/api/clinics/clinic-staff.api";
import { clinicKeys } from "./clinic-keys";

export function useClinicReceptionists(clinicId: string) {
	return useQuery({
		queryKey: clinicKeys.receptionists(clinicId),
		queryFn: () => clinicStaffApi.getReceptionists(clinicId),
		enabled: !!clinicId,
	});
}
