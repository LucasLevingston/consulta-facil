"use client";

import { useQuery } from "@tanstack/react-query";
import { servicesRepository } from "../repositories/services.repository";
import { serviceKeys } from "./service-keys";

export function useGetProfessionalServices(professionalId: string) {
	return useQuery({
		queryKey: serviceKeys.byProfessional(professionalId),
		queryFn: () => servicesRepository.getByProfessional(professionalId),
		enabled: !!professionalId,
		staleTime: 2 * 60 * 1000,
	});
}
