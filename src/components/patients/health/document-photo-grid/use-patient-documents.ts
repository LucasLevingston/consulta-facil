"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function usePatientDocuments() {
	return useSuspenseQuery({
		queryKey: patientKeys.documents,
		queryFn: patientsRepository.listDocuments,
	});
}
