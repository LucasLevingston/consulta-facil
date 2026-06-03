"use client";

import { useQuery } from "@tanstack/react-query";

import { clinicsApi } from "@/lib/api/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useClinics() {
	return useQuery({
		queryKey: clinicKeys.list(),
		queryFn: () => clinicsApi.getAll(),
	});
}
