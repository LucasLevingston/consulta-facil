"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalServicesApi } from "@/lib/api/services/professional-services.api";
import { serviceKeys } from "./service-keys";

export function useDeactivateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (serviceId: string) =>
			professionalServicesApi.deactivate(serviceId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}
