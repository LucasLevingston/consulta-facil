"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function useAddVaccine() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientsRepository.addVaccine,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.vaccines }),
	});
}
