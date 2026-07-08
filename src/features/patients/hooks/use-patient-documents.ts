"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function usePatientDocuments() {
	return useSuspenseQuery({
		queryKey: patientKeys.documents,
		queryFn: patientsRepository.listDocuments,
	});
}
