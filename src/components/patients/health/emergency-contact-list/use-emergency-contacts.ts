"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { patientKeys } from "@/components/patients/hooks";
import { patientsRepository } from "@/features/patients";

export function useEmergencyContacts() {
	return useSuspenseQuery({
		queryKey: patientKeys.emergencyContacts,
		queryFn: patientsRepository.listEmergencyContacts,
	});
}
