"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function useDeleteVaccine() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientsRepository.deleteVaccine,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.vaccines }),
	});
}
