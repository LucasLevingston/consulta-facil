"use client";

import { useQuery } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function useMedicalRecords(userId: string) {
	return useQuery({
		queryKey: patientKeys.medicalRecords(userId),
		queryFn: () => patientsApi.getMedicalRecords(userId),
		enabled: !!userId,
	});
}
