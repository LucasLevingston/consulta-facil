"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function useDeleteDocument() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientsApi.deleteDocument,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.documents }),
	});
}
