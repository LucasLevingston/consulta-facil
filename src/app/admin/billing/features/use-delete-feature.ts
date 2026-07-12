"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";

export function useDeleteFeature() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => billingContentRepository.deleteFeature(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "features"] }),
	});
}
