"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { patientsRepository } from "../repositories/patients.repository";
import { patientKeys } from "./patient-keys";

export function useVaccines() {
	return useSuspenseQuery({
		queryKey: patientKeys.vaccines,
		queryFn: patientsRepository.listVaccines,
	});
}
