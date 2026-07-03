"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { featureApi } from "@/lib/api/billing/feature.api";
import type { UpdateFeatureValues } from "@/lib/schemas/billing/feature.schema";

export function useUpdateFeature() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateFeatureValues }) =>
			featureApi.update(id, data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["billing", "features"] }),
	});
}
