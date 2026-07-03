"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateSystemFeeValues } from "@/lib/schemas/billing/system-fee.schema";
import { billingContentRepository } from "../repositories/billing-content.repository";

export function useUpdateSystemFee() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateSystemFeeValues }) =>
			billingContentRepository.updateSystemFee(id, data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "system-fees"] }),
	});
}
