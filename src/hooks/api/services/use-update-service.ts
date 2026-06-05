"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "@/lib/api/services.api";
import type { UpdateServiceInput } from "@/lib/schemas/service/update-service.schema";
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
		}) => servicesApi.update(serviceId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}
