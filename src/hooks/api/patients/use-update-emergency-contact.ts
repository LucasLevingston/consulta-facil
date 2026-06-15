"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import type { EmergencyContactInput } from "@/lib/schemas/patient/emergency-contact.schema";
import { patientKeys } from "./patient-keys";

export function useUpdateEmergencyContact() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: EmergencyContactInput }) =>
			patientsApi.updateEmergencyContact(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: patientKeys.emergencyContacts,
			}),
	});
}
