import { api } from "@/config/api";
import type {
	BillingSettingsResponse,
	UpdateBillingSettingsValues,
} from "@/lib/schemas/billing/billing-settings.schema";

export const billingSettingsApi = {
	get: async (): Promise<BillingSettingsResponse> => {
		const res = await api.get<BillingSettingsResponse>(
			"/admin/billing/settings",
		);
		return res.data;
	},

	update: async (
		data: UpdateBillingSettingsValues,
	): Promise<BillingSettingsResponse> => {
		const res = await api.patch<BillingSettingsResponse>(
			"/admin/billing/settings",
			data,
		);
		return res.data;
	},
};
