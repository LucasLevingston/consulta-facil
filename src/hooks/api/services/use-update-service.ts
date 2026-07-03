"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalServicesApi } from "@/lib/api/services/professional-services.api";
import type { UpdateServiceInput } from "@/lib/schemas/service/update-service.schema";
import { serviceKeys } from "./service-keys";

export function useUpdateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ serviceId, data }: { serviceId: string; data: UpdateServiceInput }) =>
			professionalServicesApi.update(serviceId, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}
