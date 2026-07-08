"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EmergencyContactInput } from "@/lib/schemas/patient/emergency-contact.schema";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

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
