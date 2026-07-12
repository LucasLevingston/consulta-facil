"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";
import type { UpdateFeatureValues } from "@/lib/schemas/billing/feature.schema";

export function useUpdateFeature() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateFeatureValues }) =>
			billingContentRepository.updateFeature(id, data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "features"] }),
	});
}
