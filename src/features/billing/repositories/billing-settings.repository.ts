import { billingSettingsApi } from "@/lib/api/billing/billing-settings.api";
import { commissionApi } from "@/lib/api/billing/commission.api";
import { feesApi } from "@/lib/api/billing/fees.api";
import type {
	BillingSettingsResponse,
	UpdateBillingSettingsValues,
} from "@/lib/schemas/billing/billing-settings.schema";
import type { ReferralCommissionResponse } from "@/lib/schemas/billing/commission.schema";
import type { FeeConfig } from "@/lib/schemas/fees/fee-calculation.schema";

export const billingSettingsRepository = {
	getSettings: async (): Promise<BillingSettingsResponse> =>
		billingSettingsApi.get(),
	updateSettings: async (
		data: UpdateBillingSettingsValues,
	): Promise<BillingSettingsResponse> => billingSettingsApi.update(data),

	adminListCommissions: async (): Promise<ReferralCommissionResponse[]> =>
		commissionApi.adminListAll(),

	getFeeConfig: async (): Promise<FeeConfig> => feesApi.getConfig(),
};
