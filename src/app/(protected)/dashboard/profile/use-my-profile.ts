"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function useMyProfile() {
	return useSuspenseQuery({
		queryKey: patientKeys.me(),
		queryFn: patientsRepository.getMyProfile,
	});
}
