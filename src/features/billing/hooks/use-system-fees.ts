"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingContentRepository } from "../repositories/billing-content.repository";

export function useSystemFees() {
	return useSuspenseQuery({
		queryKey: ["billing", "system-fees"],
		queryFn: billingContentRepository.listSystemFees,
	});
}
