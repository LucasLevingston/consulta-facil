"use client";

import { useQuery } from "@tanstack/react-query";
import { plansApi } from "@/lib/api/billing/plans.api";

export function usePlans() {
	return useQuery({
		queryKey: ["plans"],
		queryFn: plansApi.getActive,
		staleTime: 1000 * 60 * 10,
	});
}
