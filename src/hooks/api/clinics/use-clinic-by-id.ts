"use client";

import { useQuery } from "@tanstack/react-query";

import { clinicsApi } from "@/lib/api/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useClinicById(id: string) {
	return useQuery({
		queryKey: clinicKeys.detail(id),
		queryFn: () => clinicsApi.getById(id),
		enabled: !!id,
	});
}
