"use client";

import { useQuery } from "@tanstack/react-query";
import { servicesApi } from "@/lib/api/services.api";
import { serviceKeys } from "./service-keys";

export function useGetProfessionalServices(professionalId: string) {
	return useQuery({
		queryKey: serviceKeys.byProfessional(professionalId),
		queryFn: () => servicesApi.getByProfessional(professionalId),
		enabled: !!professionalId,
		staleTime: 2 * 60 * 1000,
	});
}
