"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingPlansRepository } from "../repositories/billing-plans.repository";

export function useAdminPlans() {
	return useSuspenseQuery({
		queryKey: ["admin", "plans"],
		queryFn: billingPlansRepository.adminListPlans,
	});
}
