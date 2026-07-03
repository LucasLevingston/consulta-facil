import { professionalSettingsApi } from "@/lib/api/professionals/professional-settings.api";
import { professionalServicesApi } from "@/lib/api/services/professional-services.api";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";
import type { UpdatePaymentSettingsInput } from "@/lib/schemas/doctor/update-payment-settings.schema";
import type { CreateServiceInput } from "@/lib/schemas/service/create-service.schema";
import type { ProfessionalService } from "@/lib/schemas/service/professional-service.schema";
import type { UpdateServiceInput } from "@/lib/schemas/service/update-service.schema";

export const servicesRepository = {
	getByProfessional: async (
		professionalId: string,
	): Promise<ProfessionalService[]> =>
		professionalServicesApi.getByProfessional(professionalId),

	create: async (data: CreateServiceInput): Promise<ProfessionalService> =>
		professionalServicesApi.create(data),

	update: async (
		serviceId: string,
		data: UpdateServiceInput,
	): Promise<ProfessionalService> =>
		professionalServicesApi.update(serviceId, data),

	deactivate: async (serviceId: string): Promise<void> =>
		professionalServicesApi.deactivate(serviceId),

	setConsultationPrice: async (price: number): Promise<unknown> =>
		professionalSettingsApi.setConsultationPrice(price),

	updatePaymentSettings: async (
		data: UpdatePaymentSettingsInput,
	): Promise<ProfessionalResponse> =>
		professionalSettingsApi.updatePaymentSettings(data),
};
