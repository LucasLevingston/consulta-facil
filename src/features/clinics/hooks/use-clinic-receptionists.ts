"use client";

import { useQuery } from "@tanstack/react-query";
import { clinicsRepository } from "../repositories/clinics.repository";
import { clinicKeys } from "./clinic-keys";

export function useClinicReceptionists(clinicId: string) {
	return useQuery({
		queryKey: clinicKeys.receptionists(clinicId),
		queryFn: () => clinicsRepository.getReceptionists(clinicId),
		enabled: !!clinicId,
	});
}
