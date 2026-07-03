"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { featureApi } from "@/lib/api/billing/feature.api";
import type { CreateFeatureValues } from "@/lib/schemas/billing/feature.schema";

export function useCreateFeature() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateFeatureValues) => featureApi.create(data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["billing", "features"] }),
	});
}
