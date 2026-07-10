"use client";

import { useQuery } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function useMyProfile(enabled = true) {
	return useQuery({
		queryKey: patientKeys.me(),
		queryFn: patientsRepository.getMyProfile,
		enabled,
	});
}
