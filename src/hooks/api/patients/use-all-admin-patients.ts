"use client";

import { useQuery } from "@tanstack/react-query";

import {
	type ProfessionalPatientsParams,
	patientProfileApi,
} from "@/lib/api/patients/patient-profile.api";
import { patientKeys } from "./patient-keys";

export function useAllAdminPatients(params: ProfessionalPatientsParams) {
	return useQuery({
		queryKey: [...patientKeys.all, "admin", params],
		queryFn: () => patientProfileApi.getAll(params),
	});
}
