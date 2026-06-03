"use client";

import { useQuery } from "@tanstack/react-query";

import {
	type ProfessionalPatientsParams,
	patientsApi,
} from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function useProfessionalPatients(
	professionalId: string,
	params: ProfessionalPatientsParams,
) {
	return useQuery({
		queryKey: [...patientKeys.all, "professional", professionalId, params],
		queryFn: () => patientsApi.getProfessionalPatients(professionalId, params),
		enabled: !!professionalId,
	});
}
