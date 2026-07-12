"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingSettingsRepository } from "@/features/billing/repositories/billing-settings.repository";
import type { UpdateBillingSettingsValues } from "@/lib/schemas/billing/billing-settings.schema";

export function useUpdateBillingSettings() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateBillingSettingsValues) =>
			billingSettingsRepository.updateSettings(data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "settings"] }),
	});
}
