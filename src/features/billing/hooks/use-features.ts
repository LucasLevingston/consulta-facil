"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingContentRepository } from "../repositories/billing-content.repository";

export function useFeatures() {
	return useSuspenseQuery({
		queryKey: ["billing", "features"],
		queryFn: billingContentRepository.listFeatures,
	});
}
