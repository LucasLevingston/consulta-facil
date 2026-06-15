"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function useAddVaccine() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientsApi.addVaccine,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.vaccines }),
	});
}
