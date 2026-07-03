"use client";

import { useQuery } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function usePatientProfile(userId: string) {
	return useQuery({
		queryKey: patientKeys.detail(userId),
		queryFn: () => patientsRepository.getProfile(userId),
		enabled: !!userId,
	});
}
