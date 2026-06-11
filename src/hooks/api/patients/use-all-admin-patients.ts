"use client";

import { useQuery } from "@tanstack/react-query";

import {
	type ProfessionalPatientsParams,
	patientsApi,
} from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function useAllAdminPatients(params: ProfessionalPatientsParams) {
	return useQuery({
		queryKey: [...patientKeys.all, "admin", params],
		queryFn: () => patientsApi.getAll(params),
	});
}
