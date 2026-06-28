"use client";

import { useQuery } from "@tanstack/react-query";

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useClinics() {
	return useQuery({
		queryKey: clinicKeys.list(),
		queryFn: () => clinicsCrudApi.getAll(),
	});
}
