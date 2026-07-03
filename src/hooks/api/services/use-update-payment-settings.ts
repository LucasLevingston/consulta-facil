"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalSettingsApi } from "@/lib/api/professionals/professional-settings.api";
import type { UpdatePaymentSettingsInput } from "@/lib/schemas/professional/update-payment-settings.schema";

export function useUpdatePaymentSettings() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdatePaymentSettingsInput) =>
			professionalSettingsApi.updatePaymentSettings(data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["professionals"] }),
	});
}
