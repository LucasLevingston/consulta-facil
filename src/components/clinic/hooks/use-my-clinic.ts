"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { clinicsRepository } from "@/features/clinics";
import { clinicKeys } from "./clinic-keys";

export function useMyClinic() {
	return useSuspenseQuery({
		queryKey: clinicKeys.my(),
		queryFn: () => clinicsRepository.getMy(),
	});
}
