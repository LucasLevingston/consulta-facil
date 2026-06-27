"use client";

import { useQuery } from "@tanstack/react-query";

import { patientDocumentsApi } from "@/lib/api/patients/patient-documents.api";
import { patientKeys } from "./patient-keys";

export function usePatientDocuments() {
	return useQuery({
		queryKey: patientKeys.documents,
		queryFn: patientDocumentsApi.listDocuments,
	});
}
