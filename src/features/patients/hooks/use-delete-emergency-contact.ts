"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

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
