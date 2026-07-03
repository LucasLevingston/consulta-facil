"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientEmergencyContactsApi } from "@/lib/api/patients/patient-emergency-contacts.api";
import { patientKeys } from "./patient-keys";

export function useAddEmergencyContact() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientEmergencyContactsApi.addEmergencyContact,
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: patientKeys.emergencyContacts,
			}),
	});
}
