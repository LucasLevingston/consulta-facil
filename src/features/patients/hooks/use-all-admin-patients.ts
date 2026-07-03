"use client";

import { useQuery } from "@tanstack/react-query";
import type { ProfessionalPatientsParams } from "@/lib/api/patients/patient-profile.api";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function useAllAdminPatients(params: ProfessionalPatientsParams) {
	return useQuery({
		queryKey: [...patientKeys.all, "admin", params],
		queryFn: () => patientsRepository.getAll(params),
	});
}
