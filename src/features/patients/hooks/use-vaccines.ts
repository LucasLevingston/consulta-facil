"use client";

import { useQuery } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function useVaccines() {
	return useQuery({
		queryKey: patientKeys.vaccines,
		queryFn: patientsRepository.listVaccines,
	});
}
