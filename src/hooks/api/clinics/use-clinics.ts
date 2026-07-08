"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useClinics() {
	return useSuspenseQuery({
		queryKey: clinicKeys.list(),
		queryFn: () => clinicsCrudApi.getAll(),
	});
}
