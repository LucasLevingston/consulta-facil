"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesRepository } from "@/features/services";

export function useSetConsultationPrice() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (price: number) =>
			servicesRepository.setConsultationPrice(price),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["professionals"] }),
	});
}
