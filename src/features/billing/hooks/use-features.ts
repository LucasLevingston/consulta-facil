"use client";

import { useQuery } from "@tanstack/react-query";
import { billingContentRepository } from "../repositories/billing-content.repository";

export function useFeatures() {
	return useQuery({
		queryKey: ["billing", "features"],
		queryFn: billingContentRepository.listFeatures,
	});
}
