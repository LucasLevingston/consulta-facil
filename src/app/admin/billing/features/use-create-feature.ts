"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";
import type { CreateFeatureValues } from "@/lib/schemas/billing/feature.schema";

export function useCreateFeature() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateFeatureValues) =>
			billingContentRepository.createFeature(data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "features"] }),
	});
}
