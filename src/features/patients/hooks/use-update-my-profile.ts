"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function useUpdateMyProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Record<string, unknown>) =>
			patientsRepository.updateMyProfile(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.me() }),
	});
}
