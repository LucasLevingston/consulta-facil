"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useClinicById(id: string) {
	return useSuspenseQuery({
		queryKey: clinicKeys.detail(id),
		queryFn: () => clinicsCrudApi.getById(id),
	});
}
