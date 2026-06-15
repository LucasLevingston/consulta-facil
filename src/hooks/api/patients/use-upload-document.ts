"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import type { DocumentType } from "@/lib/schemas/patient/patient-document.schema";
import { patientKeys } from "./patient-keys";

export function useUploadDocument() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			file,
			documentType,
			documentLabel,
		}: {
			file: File;
			documentType: DocumentType;
			documentLabel?: string;
		}) => patientsApi.uploadDocument(file, documentType, documentLabel),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.documents }),
	});
}
