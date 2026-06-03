"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function useUpdateMedicalRecords(userId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Record<string, unknown>) =>
			patientsApi.updateMedicalRecords(userId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: patientKeys.medicalRecords(userId),
			}),
	});
}
