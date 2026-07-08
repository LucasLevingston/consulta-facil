"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { patientEmergencyContactsApi } from "@/lib/api/patients/patient-emergency-contacts.api";
import { patientKeys } from "./patient-keys";

export function useEmergencyContacts() {
	return useSuspenseQuery({
		queryKey: patientKeys.emergencyContacts,
		queryFn: patientEmergencyContactsApi.listEmergencyContacts,
	});
}
