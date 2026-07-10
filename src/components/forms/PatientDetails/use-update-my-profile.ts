"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function useUpdateMyProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Record<string, unknown>) =>
			patientsRepository.updateMyProfile(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.me() }),
	});
}
