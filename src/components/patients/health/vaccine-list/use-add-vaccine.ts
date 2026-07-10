"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function useAddVaccine() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientsRepository.addVaccine,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.vaccines }),
	});
}
