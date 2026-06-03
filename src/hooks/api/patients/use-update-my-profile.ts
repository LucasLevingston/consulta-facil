"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function useUpdateMyProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Record<string, unknown>) =>
			patientsApi.updateMyProfile(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: patientKeys.me() }),
	});
}
