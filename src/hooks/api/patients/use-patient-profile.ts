"use client";

import { useQuery } from "@tanstack/react-query";

import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";
import { patientKeys } from "./patient-keys";

export function usePatientProfile(userId: string) {
	return useQuery({
		queryKey: patientKeys.detail(userId),
		queryFn: () => patientProfileApi.getProfile(userId),
		enabled: !!userId,
	});
}
