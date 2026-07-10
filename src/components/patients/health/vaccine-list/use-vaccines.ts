"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function useVaccines() {
	return useSuspenseQuery({
		queryKey: patientKeys.vaccines,
		queryFn: patientsRepository.listVaccines,
	});
}
