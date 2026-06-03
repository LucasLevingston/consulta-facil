"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "@/lib/api/services.api";
import { serviceKeys } from "./service-keys";

export function useDeactivateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (serviceId: string) => servicesApi.deactivate(serviceId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}
