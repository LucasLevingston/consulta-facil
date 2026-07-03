"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";
import { patientKeys } from "./patient-keys";

export function useUpdateMyProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Record<string, unknown>) => patientProfileApi.updateMyProfile(data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: patientKeys.me() }),
	});
}
