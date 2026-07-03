"use client";

import { useQuery } from "@tanstack/react-query";
import { billingSettingsApi } from "@/lib/api/billing/billing-settings.api";

export function useBillingSettings() {
	return useQuery({ queryKey: ["billing", "settings"], queryFn: billingSettingsApi.get });
}
