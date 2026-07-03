"use client";

import { useQuery } from "@tanstack/react-query";
import { billingSettingsRepository } from "../repositories/billing-settings.repository";

export function useBillingSettings() {
	return useQuery({
		queryKey: ["billing", "settings"],
		queryFn: billingSettingsRepository.getSettings,
	});
}
