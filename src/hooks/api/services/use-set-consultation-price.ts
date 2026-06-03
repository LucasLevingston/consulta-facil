"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "@/lib/api/services.api";

export function useSetConsultationPrice() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (price: number) => servicesApi.setConsultationPrice(price),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["professionals"] }),
	});
}
