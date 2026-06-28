"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalServicesApi } from "@/lib/api/services/professional-services.api";
import { serviceKeys } from "./service-keys";

export function useGetProfessionalServices(professionalId: string) {
	return useQuery({
		queryKey: serviceKeys.byProfessional(professionalId),
		queryFn: () => professionalServicesApi.getByProfessional(professionalId),
		enabled: !!professionalId,
		staleTime: 2 * 60 * 1000,
	});
}
