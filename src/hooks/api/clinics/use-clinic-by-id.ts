"use client";

import { useQuery } from "@tanstack/react-query";

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useClinicById(id: string) {
	return useQuery({
		queryKey: clinicKeys.detail(id),
		queryFn: () => clinicsCrudApi.getById(id),
		enabled: !!id,
	});
}
