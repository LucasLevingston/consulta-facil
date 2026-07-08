"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { patientDocumentsApi } from "@/lib/api/patients/patient-documents.api";
import { patientKeys } from "./patient-keys";

export function usePatientDocuments() {
	return useSuspenseQuery({
		queryKey: patientKeys.documents,
		queryFn: patientDocumentsApi.listDocuments,
	});
}
