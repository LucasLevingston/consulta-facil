"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function useDeleteDocument() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientsRepository.deleteDocument,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.documents }),
	});
}
