"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdatePaymentSettingsInput } from "@/lib/schemas/doctor/update-payment-settings.schema";
import { servicesRepository } from "../repositories/services.repository";

export function useUpdatePaymentSettings() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdatePaymentSettingsInput) =>
			servicesRepository.updatePaymentSettings(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["professionals"] }),
	});
}
