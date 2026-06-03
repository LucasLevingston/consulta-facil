"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "@/lib/api/services.api";
import type { CreateServiceInput } from "@/lib/schemas/service.schema";
import { serviceKeys } from "./service-keys";

export function useCreateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateServiceInput) => servicesApi.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}
