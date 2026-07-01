"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPlansRepository } from "../repositories/billing-plans.repository";

export function usePlans() {
	return useQuery({
		queryKey: ["plans"],
		queryFn: billingPlansRepository.getActivePlans,
		staleTime: 1000 * 60 * 10,
	});
}
