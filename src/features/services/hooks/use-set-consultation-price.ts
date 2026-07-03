"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesRepository } from "../repositories/services.repository";

export function useSetConsultationPrice() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (price: number) =>
			servicesRepository.setConsultationPrice(price),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["professionals"] }),
	});
}
