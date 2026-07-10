"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function useDeleteEmergencyContact() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patientsRepository.deleteEmergencyContact,
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: patientKeys.emergencyContacts,
			}),
	});
}
