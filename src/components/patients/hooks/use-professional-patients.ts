"use client";

import { useQuery } from "@tanstack/react-query";
import { patientsRepository } from "@/features/patients";
import type { ProfessionalPatientsParams } from "@/lib/api/patients/patient-profile.api.types";
import { patientKeys } from "./patient-keys";

export function useProfessionalPatients(
	professionalId: string,
	params: ProfessionalPatientsParams,
) {
	return useQuery({
		queryKey: [...patientKeys.all, "professional", professionalId, params],
		queryFn: () =>
			patientsRepository.getProfessionalPatients(professionalId, params),
		enabled: !!professionalId,
	});
}
