"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "@/lib/api/services.api";
import type {
	CreateServiceInput,
	UpdateServiceInput,
} from "@/lib/schemas/service.schema";

export const serviceKeys = {
	all: ["professional-services"] as const,
	byProfessional: (professionalId: string) =>
		[...serviceKeys.all, professionalId] as const,
};

export function useGetProfessionalServices(professionalId: string) {
	return useQuery({
		queryKey: serviceKeys.byProfessional(professionalId),
		queryFn: () => servicesApi.getByProfessional(professionalId),
		enabled: !!professionalId,
	});
}

export function useCreateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateServiceInput) => servicesApi.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}

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

export function useDeactivateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (serviceId: string) => servicesApi.deactivate(serviceId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
	});
}

export function useSetConsultationPrice() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (price: number) => servicesApi.setConsultationPrice(price),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["professionals"] }),
	});
}
