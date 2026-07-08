"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingSettingsRepository } from "../repositories/billing-settings.repository";

export function useFeeConfig() {
	return useSuspenseQuery({
		queryKey: ["fees", "config"],
		queryFn: billingSettingsRepository.getFeeConfig,
		staleTime: 1000 * 60 * 60,
	});
}
