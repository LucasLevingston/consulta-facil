"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientEmergencyContactsApi } from "@/lib/api/patients/patient-emergency-contacts.api";
import { patientKeys } from "./patient-keys";

export function useDeleteEmergencyContact() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientEmergencyContactsApi.deleteEmergencyContact,
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: patientKeys.emergencyContacts,
			}),
	});
}
