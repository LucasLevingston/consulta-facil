import { api } from "@/config/api";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";
import type { UpdatePaymentSettingsInput } from "@/lib/schemas/doctor/update-payment-settings.schema";

export const professionalSettingsApi = {
	setConsultationPrice: async (price: number): Promise<unknown> => {
		const response = await api.put("/professionals/me/consultation-price", {
			price,
		});
		return response.data;
	},

	updatePaymentSettings: async (
		data: UpdatePaymentSettingsInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.put<ProfessionalResponse>(
			"/professionals/me/payment-settings",
			data,
		);
		return response.data;
	},
};
