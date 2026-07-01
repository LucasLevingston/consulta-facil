"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateFeatureValues } from "@/lib/schemas/billing/feature.schema";
import { billingContentRepository } from "../repositories/billing-content.repository";

export function useCreateFeature() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateFeatureValues) =>
			billingContentRepository.createFeature(data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "features"] }),
	});
}
