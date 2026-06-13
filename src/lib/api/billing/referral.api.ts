import { api } from "@/config/api";
import type {
	ReferralCodeResponse,
	ReferralResponse,
	ReferralStatsResponse,
} from "@/lib/schemas/billing/referral.schema";

export const referralApi = {
	myStats: async (): Promise<ReferralStatsResponse> => {
		const res = await api.get<ReferralStatsResponse>("/referrals/me");
		return res.data;
	},

	regenerate: async (): Promise<ReferralCodeResponse> => {
		const res = await api.post<ReferralCodeResponse>(
			"/referrals/me/regenerate",
		);
		return res.data;
	},

	register: async (code: string): Promise<void> => {
		await api.post("/referrals/register", { code });
	},

	adminListAll: async (): Promise<ReferralResponse[]> => {
		const res = await api.get<ReferralResponse[]>("/admin/billing/referrals");
		return res.data;
	},
};
