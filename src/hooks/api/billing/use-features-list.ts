"use client";

import { useQuery } from "@tanstack/react-query";
import { featureApi } from "@/lib/api/billing/feature.api";

export function useFeatures() {
	return useQuery({ queryKey: ["billing", "features"], queryFn: featureApi.listAll });
}
