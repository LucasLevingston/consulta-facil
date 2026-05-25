import { api } from "@/config/api";
import type {
	CreateServiceInput,
	ProfessionalService,
	UpdateServiceInput,
} from "@/lib/schemas/service.schema";

export const servicesApi = {
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

	setConsultationPrice: async (price: number): Promise<unknown> => {
		const response = await api.put("/professionals/me/consultation-price", {
			price,
		});
		return response.data;
	},
};
