"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientHealthApi } from "@/lib/api/patients/patient-health.api";
import { patientKeys } from "./patient-keys";

export function useUpdateMedicalRecords(userId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Record<string, unknown>) =>
			patientHealthApi.updateMedicalRecords(userId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: patientKeys.medicalRecords(userId),
			}),
	});
}
