"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingSettingsRepository } from "../repositories/billing-settings.repository";

export function useBillingSettings() {
	return useSuspenseQuery({
		queryKey: ["billing", "settings"],
		queryFn: billingSettingsRepository.getSettings,
	});
}
