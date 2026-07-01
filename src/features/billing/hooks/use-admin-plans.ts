"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPlansRepository } from "../repositories/billing-plans.repository";

export function useAdminPlans() {
	return useQuery({
		queryKey: ["admin", "plans"],
		queryFn: billingPlansRepository.adminListPlans,
	});
}
