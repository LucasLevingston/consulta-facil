"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientDocumentsApi } from "@/lib/api/patients/patient-documents.api";
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
		}) => patientDocumentsApi.uploadDocument(file, documentType, documentLabel),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.documents }),
	});
}
