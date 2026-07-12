"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";
import type { UpdateSystemFeeValues } from "@/lib/schemas/billing/system-fee.schema";

export function useUpdateSystemFee() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateSystemFeeValues }) =>
			billingContentRepository.updateSystemFee(id, data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "system-fees"] }),
	});
}
