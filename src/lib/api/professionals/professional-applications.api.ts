import { api } from "@/config/api";
import type { ApiPage } from "@/lib/schemas/professional/api-page.schema";
import type { CreateProfessionalInput } from "@/lib/schemas/professional/create-professional.schema";
import type { ProfessionalResponse } from "@/lib/schemas/professional/professional-response.schema";

export const professionalApplicationsApi = {
	create: async (
		data: CreateProfessionalInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.post<ProfessionalResponse>(
			"/professionals",
			data,
		);
		return response.data;
	},

	getPendingApplications: async (
		page = 0,
		size = 20,
	): Promise<ApiPage<ProfessionalResponse>> => {
		const response = await api.get<ApiPage<ProfessionalResponse>>(
			"/professionals/applications",
			{ params: { page, size } },
		);
		return response.data;
	},

	getApplicationStatus: async (): Promise<ProfessionalResponse> => {
		const response = await api.get<ProfessionalResponse>(
			"/professionals/application-status",
		);
		return response.data;
	},

	approve: async (professionalId: string): Promise<ProfessionalResponse> => {
		const response = await api.put<ProfessionalResponse>(
			`/professionals/${professionalId}/approve`,
		);
		return response.data;
	},

	reject: async (professionalId: string): Promise<ProfessionalResponse> => {
		const response = await api.put<ProfessionalResponse>(
			`/professionals/${professionalId}/reject`,
		);
		return response.data;
	},
};
