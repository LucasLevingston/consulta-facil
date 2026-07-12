"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingPlansRepository } from "@/features/billing/repositories/billing-plans.repository";

export function usePlans() {
	return useSuspenseQuery({
		queryKey: ["plans"],
		queryFn: billingPlansRepository.getActivePlans,
		staleTime: 1000 * 60 * 10,
	});
}
