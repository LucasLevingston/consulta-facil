"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function useUpdateMedicalRecords(userId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Record<string, unknown>) =>
			patientsRepository.updateMedicalRecords(userId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: patientKeys.medicalRecords(userId),
			}),
	});
}
