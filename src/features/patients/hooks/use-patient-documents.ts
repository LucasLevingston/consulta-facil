"use client";

import { useQuery } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function usePatientDocuments() {
	return useQuery({
		queryKey: patientKeys.documents,
		queryFn: patientsRepository.listDocuments,
	});
}
