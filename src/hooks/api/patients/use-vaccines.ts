"use client";

import { useQuery } from "@tanstack/react-query";

import { patientVaccinesApi } from "@/lib/api/patients/patient-vaccines.api";
import { patientKeys } from "./patient-keys";

export function useVaccines() {
	return useQuery({
		queryKey: patientKeys.vaccines,
		queryFn: patientVaccinesApi.listVaccines,
	});
}
