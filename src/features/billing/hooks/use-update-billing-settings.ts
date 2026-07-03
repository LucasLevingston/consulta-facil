"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateBillingSettingsValues } from "@/lib/schemas/billing/billing-settings.schema";
import { billingSettingsRepository } from "../repositories/billing-settings.repository";

export function useUpdateBillingSettings() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateBillingSettingsValues) =>
			billingSettingsRepository.updateSettings(data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "settings"] }),
	});
}
