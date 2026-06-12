"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { featureApi } from "@/lib/api/billing/feature.api";
import type {
	CreateFeatureValues,
	UpdateFeatureValues,
} from "@/lib/schemas/billing/feature.schema";

export function useFeatures() {
	return useQuery({
		queryKey: ["billing", "features"],
		queryFn: featureApi.listAll,
	});
}

export function useCreateFeature() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateFeatureValues) => featureApi.create(data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "features"] }),
	});
}

export function useUpdateFeature() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateFeatureValues }) =>
			featureApi.update(id, data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "features"] }),
	});
}

export function useDeleteFeature() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => featureApi.delete(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "features"] }),
	});
}
