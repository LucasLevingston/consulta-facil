"use client";

import { useQuery } from "@tanstack/react-query";
import { systemFeeApi } from "@/lib/api/billing/system-fee.api";

export function useSystemFees() {
	return useQuery({ queryKey: ["billing", "system-fees"], queryFn: systemFeeApi.listAll });
}
