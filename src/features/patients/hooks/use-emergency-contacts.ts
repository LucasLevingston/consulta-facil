"use client";

import { useQuery } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function useEmergencyContacts() {
	return useQuery({
		queryKey: patientKeys.emergencyContacts,
		queryFn: patientsRepository.listEmergencyContacts,
	});
}
