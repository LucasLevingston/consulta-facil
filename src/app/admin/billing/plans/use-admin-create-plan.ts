"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingPlansRepository } from "@/features/billing/repositories/billing-plans.repository";
import type { CreatePlanValues } from "@/lib/api/billing/plans.api.types";

export function useAdminCreatePlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreatePlanValues) =>
			billingPlansRepository.adminCreatePlan(data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "plans"] }),
	});
}
