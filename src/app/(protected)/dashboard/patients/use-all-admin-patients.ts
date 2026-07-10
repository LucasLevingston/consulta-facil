"use client";

import { useQuery } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";
import type { ProfessionalPatientsParams } from "@/lib/api/patients/patient-profile.api.types";

export function useAllAdminPatients(params: ProfessionalPatientsParams) {
	return useQuery({
		queryKey: [...patientKeys.all, "admin", params],
		queryFn: () => patientsRepository.getAllPatients(params),
	});
}
