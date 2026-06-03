"use client";

import { useQuery } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function useMyProfile(enabled = true) {
	return useQuery({
		queryKey: patientKeys.me(),
		queryFn: patientsApi.getMyProfile,
		enabled,
	});
}
