"use client";

import { useQuery } from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients.api";
import { patientKeys } from "./patient-keys";

export function useVaccines() {
	return useQuery({
		queryKey: patientKeys.vaccines,
		queryFn: patientsApi.listVaccines,
	});
}
