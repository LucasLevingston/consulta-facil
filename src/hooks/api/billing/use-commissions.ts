"use client";

import { useQuery } from "@tanstack/react-query";
import { commissionApi } from "@/lib/api/billing/commission.api";

export function useAdminCommissions() {
	return useQuery({
		queryKey: ["admin-commissions"],
		queryFn: commissionApi.adminListAll,
	});
}
