"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DocumentType } from "@/lib/schemas/patient/patient-document.schema";
import { patientsRepository } from "../repositories/patients.repository";
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
		}) => patientsRepository.uploadDocument(file, documentType, documentLabel),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.documents }),
	});
}
