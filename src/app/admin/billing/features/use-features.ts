"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";

export function useFeatures() {
	return useSuspenseQuery({
		queryKey: ["billing", "features"],
		queryFn: billingContentRepository.listFeatures,
	});
}
