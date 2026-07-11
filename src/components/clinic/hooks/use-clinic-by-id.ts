"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { clinicsRepository } from "@/features/clinics";
import { clinicKeys } from "./clinic-keys";

export function useClinicById(id: string) {
	return useSuspenseQuery({
		queryKey: clinicKeys.detail(id),
		queryFn: () => clinicsRepository.getById(id),
	});
}
