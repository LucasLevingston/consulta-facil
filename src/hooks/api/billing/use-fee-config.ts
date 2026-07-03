"use client";

import { useQuery } from "@tanstack/react-query";
import { feesApi } from "@/lib/api/billing/fees.api";

export function useFeeConfig() {
	return useQuery({
		queryKey: ["fees", "config"],
		queryFn: feesApi.getConfig,
		staleTime: 1000 * 60 * 60,
	});
}
