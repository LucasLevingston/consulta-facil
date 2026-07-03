"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalSettingsApi } from "@/lib/api/professionals/professional-settings.api";

export function useSetConsultationPrice() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (price: number) =>
			professionalSettingsApi.setConsultationPrice(price),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["professionals"] }),
	});
}
