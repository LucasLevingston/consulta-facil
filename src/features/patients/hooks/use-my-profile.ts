"use client";

import { useQuery } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function useMyProfile(enabled = true) {
	return useQuery({
		queryKey: patientKeys.me(),
		queryFn: patientsRepository.getMyProfile,
		enabled,
	});
}
