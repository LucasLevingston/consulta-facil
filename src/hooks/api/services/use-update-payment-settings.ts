"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "@/lib/api/services.api";
import type { UpdatePaymentSettingsInput } from "@/lib/schemas/doctor/update-payment-settings.schema";

export function useUpdatePaymentSettings() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdatePaymentSettingsInput) =>
			servicesApi.updatePaymentSettings(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["professionals"] }),
	});
}
