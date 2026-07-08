"use client";

import { useQuery } from "@tanstack/react-query";
import type { ProfessionalPatientsParams } from "@/lib/api/patients/patient-profile.api.types";
import { patientsRepository } from "../repositories/patients.repository";
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
