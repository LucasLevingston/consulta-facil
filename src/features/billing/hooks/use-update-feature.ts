"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateFeatureValues } from "@/lib/schemas/billing/feature.schema";
import { billingContentRepository } from "../repositories/billing-content.repository";

export function useUpdateFeature() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateFeatureValues }) =>
			billingContentRepository.updateFeature(id, data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "features"] }),
	});
}
