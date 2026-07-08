"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { patientVaccinesApi } from "@/lib/api/patients/patient-vaccines.api";
import { patientKeys } from "./patient-keys";

export function useVaccines() {
	return useSuspenseQuery({
		queryKey: patientKeys.vaccines,
		queryFn: patientVaccinesApi.listVaccines,
	});
}
