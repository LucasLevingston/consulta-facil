"use client";

import { useQuery } from "@tanstack/react-query";

import {
	type ProfessionalPatientsParams,
	patientProfileApi,
} from "@/lib/api/patients/patient-profile.api";
import { patientKeys } from "./patient-keys";

export function useProfessionalPatients(
	professionalId: string,
	params: ProfessionalPatientsParams,
) {
	return useQuery({
		queryKey: [...patientKeys.all, "professional", professionalId, params],
		queryFn: () => patientProfileApi.getProfessionalPatients(professionalId, params),
		enabled: !!professionalId,
	});
}
