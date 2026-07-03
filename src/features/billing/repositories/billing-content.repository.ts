import { featureApi } from "@/lib/api/billing/feature.api";
import { systemFeeApi } from "@/lib/api/billing/system-fee.api";
import type {
	CreateFeatureValues,
	FeatureResponse,
	UpdateFeatureValues,
} from "@/lib/schemas/billing/feature.schema";
import type {
	SystemFeeResponse,
	UpdateSystemFeeValues,
} from "@/lib/schemas/billing/system-fee.schema";

export const billingContentRepository = {
	listFeatures: async (): Promise<FeatureResponse[]> => featureApi.listAll(),
	createFeature: async (data: CreateFeatureValues): Promise<FeatureResponse> =>
		featureApi.create(data),
	updateFeature: async (
		id: string,
		data: UpdateFeatureValues,
	): Promise<FeatureResponse> => featureApi.update(id, data),
	deleteFeature: async (id: string): Promise<void> => featureApi.delete(id),

	listSystemFees: async (): Promise<SystemFeeResponse[]> =>
		systemFeeApi.listAll(),
	updateSystemFee: async (
		id: string,
		data: UpdateSystemFeeValues,
	): Promise<SystemFeeResponse> => systemFeeApi.update(id, data),
};
