"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingPlansRepository } from "@/features/billing/repositories/billing-plans.repository";

export function useAdminDeactivatePlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => billingPlansRepository.adminDeactivatePlan(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "plans"] }),
	});
}
