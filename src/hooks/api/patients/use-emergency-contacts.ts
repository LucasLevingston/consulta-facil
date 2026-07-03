"use client";

import { useQuery } from "@tanstack/react-query";

import { patientEmergencyContactsApi } from "@/lib/api/patients/patient-emergency-contacts.api";
import { patientKeys } from "./patient-keys";

export function useEmergencyContacts() {
	return useQuery({
		queryKey: patientKeys.emergencyContacts,
		queryFn: patientEmergencyContactsApi.listEmergencyContacts,
	});
}
