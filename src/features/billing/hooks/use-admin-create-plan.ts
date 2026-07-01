"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePlanValues } from "@/lib/api/billing/plans.api.types";
import { billingPlansRepository } from "../repositories/billing-plans.repository";

export function useAdminCreatePlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreatePlanValues) =>
			billingPlansRepository.adminCreatePlan(data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "plans"] }),
	});
}
