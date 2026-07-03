import { api } from "@/config/api";
import type { CreatePlanValues, PlanResponse } from "./plans.api.types";

export type { CreatePlanValues, PlanResponse } from "./plans.api.types";

export const plansApi = {
	getActive: async (): Promise<PlanResponse[]> => {
		const response = await api.get<PlanResponse[]>("/plans");
		return response.data;
	},

	getBySlug: async (slug: string): Promise<PlanResponse> => {
		const response = await api.get<PlanResponse>(`/plans/${slug}`);
		return response.data;
	},

	adminListAll: async (): Promise<PlanResponse[]> => {
		const response = await api.get<PlanResponse[]>("/admin/plans");
		return response.data;
	},

	adminCreate: async (data: CreatePlanValues): Promise<PlanResponse> => {
		const response = await api.post<PlanResponse>("/admin/plans", data);
		return response.data;
	},

	adminUpdate: async (
		id: string,
		data: Partial<CreatePlanValues>,
	): Promise<PlanResponse> => {
		const response = await api.patch<PlanResponse>(`/admin/plans/${id}`, data);
		return response.data;
	},

	adminDeactivate: async (id: string): Promise<void> => {
		await api.patch(`/admin/plans/${id}/deactivate`);
	},
};
