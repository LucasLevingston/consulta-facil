"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingSettingsApi } from "@/lib/api/billing/billing-settings.api";
import type { UpdateBillingSettingsValues } from "@/lib/schemas/billing/billing-settings.schema";

export function useUpdateBillingSettings() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateBillingSettingsValues) => billingSettingsApi.update(data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["billing", "settings"] }),
	});
}
