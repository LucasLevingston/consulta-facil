"use client";

import { useQuery } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function usePatientProfile(userId: string) {
	return useQuery({
		queryKey: patientKeys.detail(userId),
		queryFn: () => patientsApi.getProfile(userId),
		enabled: !!userId,
	});
}
