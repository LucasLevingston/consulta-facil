"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function useDeleteDocument() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientsRepository.deleteDocument,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.documents }),
	});
}
