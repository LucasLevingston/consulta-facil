import { professionalSettingsApi } from "@/lib/api/professionals/professional-settings.api";
import { professionalServicesApi } from "@/lib/api/services/professional-services.api";
import type { ProfessionalResponse } from "@/lib/schemas/professional/professional-response.schema";
import type { UpdatePaymentSettingsInput } from "@/lib/schemas/professional/update-payment-settings.schema";
import type { CreateServiceInput } from "@/lib/schemas/service/create-service.schema";
import type { ProfessionalService } from "@/lib/schemas/service/professional-service.schema";
import type { UpdateServiceInput } from "@/lib/schemas/service/update-service.schema";

export const servicesRepository = {
	create: (data: CreateServiceInput): Promise<ProfessionalService> =>
		professionalServicesApi.create(data),

	getByProfessional: (professionalId: string): Promise<ProfessionalService[]> =>
		professionalServicesApi.getByProfessional(professionalId),

	update: (
		serviceId: string,
		data: UpdateServiceInput,
	): Promise<ProfessionalService> =>
		professionalServicesApi.update(serviceId, data),

	deactivate: (serviceId: string): Promise<void> =>
		professionalServicesApi.deactivate(serviceId),

	setConsultationPrice: (price: number): Promise<unknown> =>
		professionalSettingsApi.setConsultationPrice(price),

	updatePaymentSettings: (
		data: UpdatePaymentSettingsInput,
	): Promise<ProfessionalResponse> =>
		professionalSettingsApi.updatePaymentSettings(data),
};
