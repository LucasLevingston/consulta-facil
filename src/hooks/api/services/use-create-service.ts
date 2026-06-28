"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalServicesApi } from "@/lib/api/services/professional-services.api";
import type { CreateServiceInput } from "@/lib/schemas/service/create-service.schema";
import { serviceKeys } from "./service-keys";

export function useCreateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateServiceInput) =>
			professionalServicesApi.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}
