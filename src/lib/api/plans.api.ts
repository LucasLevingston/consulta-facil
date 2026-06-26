import { api } from "@/config/api";

export interface PlanResponse {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	tier: string;
	billingPeriod: "MONTHLY" | "SEMIANNUAL" | "ANNUAL";
	price: number;
	frequency: number;
	frequencyType: string;
	features: string[];
	maxAppointments: number | null;
	status: "ACTIVE" | "INACTIVE";
	displayOrder: number;
}

export interface CreatePlanValues {
	slug: string;
	name: string;
	description?: string;
	tier: string;
	billingPeriod: "MONTHLY" | "SEMIANNUAL" | "ANNUAL";
	price: number;
	maxAppointments?: number;
	displayOrder?: number;
	features?: string[];
}

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
