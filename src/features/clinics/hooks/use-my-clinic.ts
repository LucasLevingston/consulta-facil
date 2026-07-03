"use client";

import { useQuery } from "@tanstack/react-query";
import { clinicsRepository } from "../repositories/clinics.repository";
import { clinicKeys } from "./clinic-keys";

export function useMyClinic() {
	return useQuery({
		queryKey: clinicKeys.my(),
		queryFn: clinicsRepository.getMy,
	});
}
