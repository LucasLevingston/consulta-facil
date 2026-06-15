"use client";

import { useQuery } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function useEmergencyContacts() {
	return useQuery({
		queryKey: patientKeys.emergencyContacts,
		queryFn: patientsApi.listEmergencyContacts,
	});
}
