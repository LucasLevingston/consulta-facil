"use client";

import { useQuery } from "@tanstack/react-query";
import { plansApi } from "@/lib/api/billing/plans.api";

export function useAdminPlans() {
	return useQuery({ queryKey: ["admin", "plans"], queryFn: plansApi.adminListAll });
}
