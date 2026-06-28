"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type CreatePlanValues, plansApi } from "@/lib/api/billing/plans.api";

export function usePlans() {
	return useQuery({
		queryKey: ["plans"],
		queryFn: plansApi.getActive,
		staleTime: 1000 * 60 * 10,
	});
}

export function useAdminPlans() {
	return useQuery({
		queryKey: ["admin", "plans"],
		queryFn: plansApi.adminListAll,
	});
}

export function useAdminCreatePlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreatePlanValues) => plansApi.adminCreate(data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "plans"] }),
	});
}

export function useAdminDeactivatePlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => plansApi.adminDeactivate(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "plans"] }),
	});
}
