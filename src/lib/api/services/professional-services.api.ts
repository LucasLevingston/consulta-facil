import { api } from "@/config/api";
import type { CreateServiceInput } from "@/lib/schemas/service/create-service.schema";
import type { ProfessionalService } from "@/lib/schemas/service/professional-service.schema";
import type { UpdateServiceInput } from "@/lib/schemas/service/update-service.schema";

export const professionalServicesApi = {
	create: async (data: CreateServiceInput): Promise<ProfessionalService> => {
		const response = await api.post<ProfessionalService>(
			"/professional-services",
			data,
		);
		return response.data;
	},

	getByProfessional: async (
		professionalId: string,
	): Promise<ProfessionalService[]> => {
		const response = await api.get<ProfessionalService[]>(
			`/professional-services/${professionalId}`,
		);
		return response.data;
	},

	update: async (
		serviceId: string,
		data: UpdateServiceInput,
	): Promise<ProfessionalService> => {
		const response = await api.put<ProfessionalService>(
			`/professional-services/${serviceId}`,
			data,
		);
		return response.data;
	},

	deactivate: async (serviceId: string): Promise<void> => {
		await api.delete(`/professional-services/${serviceId}`);
	},
};
