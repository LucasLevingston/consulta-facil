"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function useDeleteEmergencyContact() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientsApi.deleteEmergencyContact,
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: patientKeys.emergencyContacts,
			}),
	});
}
