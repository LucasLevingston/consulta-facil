"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { clinicsRepository } from "../repositories/clinics.repository";
import { clinicKeys } from "./clinic-keys";

export function useClinics() {
	return useSuspenseQuery({
		queryKey: clinicKeys.list(),
		queryFn: () => clinicsRepository.getAll(),
	});
}
