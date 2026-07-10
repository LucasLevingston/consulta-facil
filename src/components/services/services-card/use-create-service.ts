"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesRepository } from "@/features/services";
import type { CreateServiceInput } from "@/lib/schemas/service/create-service.schema";
import { serviceKeys } from "./service-keys";

export function useCreateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateServiceInput) => servicesRepository.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}
