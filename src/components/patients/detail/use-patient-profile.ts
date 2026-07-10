"use client";

import { useQuery } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function usePatientProfile(userId: string) {
	return useQuery({
		queryKey: patientKeys.detail(userId),
		queryFn: () => patientsRepository.getProfile(userId),
		enabled: !!userId,
	});
}
