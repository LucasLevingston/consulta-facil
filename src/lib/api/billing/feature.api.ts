import { api } from "@/config/api";
import type {
	CreateFeatureValues,
	FeatureResponse,
	UpdateFeatureValues,
} from "@/lib/schemas/billing/feature.schema";

export const featureApi = {
	listAll: async (): Promise<FeatureResponse[]> => {
		const res = await api.get<FeatureResponse[]>("/admin/billing/features");
		return res.data;
	},

	getById: async (id: string): Promise<FeatureResponse> => {
		const res = await api.get<FeatureResponse>(`/admin/billing/features/${id}`);
		return res.data;
	},

	create: async (data: CreateFeatureValues): Promise<FeatureResponse> => {
		const res = await api.post<FeatureResponse>(
			"/admin/billing/features",
			data,
		);
		return res.data;
	},

	update: async (
		id: string,
		data: UpdateFeatureValues,
	): Promise<FeatureResponse> => {
		const res = await api.patch<FeatureResponse>(
			`/admin/billing/features/${id}`,
			data,
		);
		return res.data;
	},

	delete: async (id: string): Promise<void> => {
		await api.delete(`/admin/billing/features/${id}`);
	},
};
