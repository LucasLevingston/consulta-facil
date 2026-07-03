"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plansApi } from "@/lib/api/billing/plans.api";

export function useAdminDeactivatePlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => plansApi.adminDeactivate(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "plans"] }),
	});
}
