"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateServiceInput } from "@/lib/schemas/service/create-service.schema";
import { servicesRepository } from "../repositories/services.repository";
import { serviceKeys } from "./service-keys";

export function useCreateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateServiceInput) => servicesRepository.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}
