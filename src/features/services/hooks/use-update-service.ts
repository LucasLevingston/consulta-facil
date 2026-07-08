"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateServiceInput } from "@/lib/schemas/service/update-service.schema";
import { servicesRepository } from "../repositories/services.repository";
import { serviceKeys } from "./service-keys";

export function useUpdateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			serviceId,
			data,
		}: {
			serviceId: string;
			data: UpdateServiceInput;
		}) => servicesRepository.update(serviceId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}
