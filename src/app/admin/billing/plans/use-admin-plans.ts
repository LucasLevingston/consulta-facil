"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingPlansRepository } from "@/features/billing/repositories/billing-plans.repository";

export function useAdminPlans() {
	return useSuspenseQuery({
		queryKey: ["admin", "plans"],
		queryFn: billingPlansRepository.adminListPlans,
	});
}
