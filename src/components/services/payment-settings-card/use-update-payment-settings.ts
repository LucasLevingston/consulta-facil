"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesRepository } from "@/features/services";
import type { UpdatePaymentSettingsInput } from "@/lib/schemas/professional/update-payment-settings.schema";

export function useUpdatePaymentSettings() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdatePaymentSettingsInput) =>
			servicesRepository.updatePaymentSettings(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["professionals"] }),
	});
}
