"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientVaccinesApi } from "@/lib/api/patients/patient-vaccines.api";
import { patientKeys } from "./patient-keys";

export function useAddVaccine() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientVaccinesApi.addVaccine,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: patientKeys.vaccines }),
	});
}
