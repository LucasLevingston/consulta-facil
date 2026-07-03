"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { featureApi } from "@/lib/api/billing/feature.api";

export function useDeleteFeature() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => featureApi.delete(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["billing", "features"] }),
	});
}
