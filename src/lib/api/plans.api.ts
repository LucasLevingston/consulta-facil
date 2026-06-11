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

export const plansApi = {
	getActive: async (): Promise<PlanResponse[]> => {
		const response = await api.get<PlanResponse[]>("/plans");
		return response.data;
	},

	getBySlug: async (slug: string): Promise<PlanResponse> => {
		const response = await api.get<PlanResponse>(`/plans/${slug}`);
		return response.data;
	},
};
