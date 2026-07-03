"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreatePlanValues, plansApi } from "@/lib/api/billing/plans.api";

export function useAdminCreatePlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreatePlanValues) => plansApi.adminCreate(data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "plans"] }),
	});
}
