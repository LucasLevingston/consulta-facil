"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { systemFeeApi } from "@/lib/api/billing/system-fee.api";
import type { UpdateSystemFeeValues } from "@/lib/schemas/billing/system-fee.schema";

export function useSystemFees() {
	return useQuery({
		queryKey: ["billing", "system-fees"],
		queryFn: systemFeeApi.listAll,
	});
}

export function useUpdateSystemFee() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateSystemFeeValues }) =>
			systemFeeApi.update(id, data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "system-fees"] }),
	});
}
