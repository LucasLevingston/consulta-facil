"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";
import type { EmergencyContactInput } from "@/lib/schemas/patient/emergency-contact.schema";

export function useUpdateEmergencyContact() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: EmergencyContactInput }) =>
			patientsRepository.updateEmergencyContact(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: patientKeys.emergencyContacts,
			}),
	});
}
