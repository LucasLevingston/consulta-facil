"use client";

import { useQuery } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function useMedicalRecords(userId: string) {
	return useQuery({
		queryKey: patientKeys.medicalRecords(userId),
		queryFn: () => patientsRepository.getMedicalRecords(userId),
		enabled: !!userId,
	});
}
