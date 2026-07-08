"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingSettingsRepository } from "../repositories/billing-settings.repository";

export function useAdminCommissions() {
	return useSuspenseQuery({
		queryKey: ["admin-commissions"],
		queryFn: billingSettingsRepository.adminListCommissions,
	});
}
