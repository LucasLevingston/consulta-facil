import { api } from "@/config/api";
import type { ReferralCommissionResponse } from "@/lib/schemas/billing/commission.schema";

export const commissionApi = {
	adminListAll: async (): Promise<ReferralCommissionResponse[]> => {
		const res = await api.get<ReferralCommissionResponse[]>(
			"/admin/billing/commissions",
		);
		return res.data;
	},
};
