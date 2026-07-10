"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesRepository } from "@/features/services";
import { serviceKeys } from "./service-keys";

export function useDeactivateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (serviceId: string) => servicesRepository.deactivate(serviceId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}
