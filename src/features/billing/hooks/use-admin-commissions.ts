"use client";

import { useQuery } from "@tanstack/react-query";
import { billingSettingsRepository } from "../repositories/billing-settings.repository";

export function useAdminCommissions() {
	return useQuery({
		queryKey: ["admin-commissions"],
		queryFn: billingSettingsRepository.adminListCommissions,
	});
}
