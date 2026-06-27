"use client";

import { useQuery } from "@tanstack/react-query";

import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";
import { patientKeys } from "./patient-keys";

export function useMyProfile(enabled = true) {
	return useQuery({
		queryKey: patientKeys.me(),
		queryFn: patientProfileApi.getMyProfile,
		enabled,
	});
}
