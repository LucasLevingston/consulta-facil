"use client";

import { useQuery } from "@tanstack/react-query";

import { patientHealthApi } from "@/lib/api/patients/patient-health.api";
import { patientKeys } from "./patient-keys";

export function useMedicalRecords(userId: string) {
	return useQuery({
		queryKey: patientKeys.medicalRecords(userId),
		queryFn: () => patientHealthApi.getMedicalRecords(userId),
		enabled: !!userId,
	});
}
