"use client";

import { useQuery } from "@tanstack/react-query";
import { clinicsRepository } from "../repositories/clinics.repository";
import { clinicKeys } from "./clinic-keys";

export function useClinicById(id: string) {
	return useQuery({
		queryKey: clinicKeys.detail(id),
		queryFn: () => clinicsRepository.getById(id),
		enabled: !!id,
	});
}
