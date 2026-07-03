"use client";

import { useQuery } from "@tanstack/react-query";
import { clinicsRepository } from "../repositories/clinics.repository";
import { clinicKeys } from "./clinic-keys";

export function useClinics() {
	return useQuery({
		queryKey: clinicKeys.list(),
		queryFn: clinicsRepository.getAll,
	});
}
