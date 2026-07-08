"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useMyClinic() {
	return useSuspenseQuery({
		queryKey: clinicKeys.my(),
		queryFn: () => clinicsCrudApi.getMy(),
	});
}
