"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function useEmergencyContacts() {
	return useSuspenseQuery({
		queryKey: patientKeys.emergencyContacts,
		queryFn: patientsRepository.listEmergencyContacts,
	});
}
