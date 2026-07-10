"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";
import type { DocumentType } from "@/lib/schemas/patient/patient-document.schema";

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
		}) => patientsRepository.uploadDocument(file, documentType, documentLabel),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.documents }),
	});
}
