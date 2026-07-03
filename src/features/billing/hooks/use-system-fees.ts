"use client";

import { useQuery } from "@tanstack/react-query";
import { billingContentRepository } from "../repositories/billing-content.repository";

export function useSystemFees() {
	return useQuery({
		queryKey: ["billing", "system-fees"],
		queryFn: billingContentRepository.listSystemFees,
	});
}
