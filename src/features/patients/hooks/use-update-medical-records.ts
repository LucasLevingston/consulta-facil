"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

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
