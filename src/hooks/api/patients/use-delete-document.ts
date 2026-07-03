"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientDocumentsApi } from "@/lib/api/patients/patient-documents.api";
import { patientKeys } from "./patient-keys";

export function useDeleteDocument() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientDocumentsApi.deleteDocument,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: patientKeys.documents }),
	});
}
