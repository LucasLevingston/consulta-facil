"use client";

import { useQuery } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function usePatientDocuments() {
	return useQuery({
		queryKey: patientKeys.documents,
		queryFn: patientsApi.listDocuments,
	});
}
