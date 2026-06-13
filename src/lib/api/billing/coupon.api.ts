import { api } from "@/config/api";
import type {
	CouponUsageResponse,
	CouponValidationResult,
} from "@/lib/schemas/billing/coupon.schema";

export const couponApi = {
	validate: async (
		code: string,
		userId: string,
		amount: number,
	): Promise<CouponValidationResult> => {
		const res = await api.post<CouponValidationResult>(
			"/billing/coupons/validate",
			{ code, userId, amount },
		);
		return res.data;
	},

	apply: async (
		code: string,
		userId: string,
		paymentId: string | null,
		amount: number,
	): Promise<CouponUsageResponse> => {
		const res = await api.post<CouponUsageResponse>("/billing/coupons/apply", {
			code,
			userId,
			paymentId,
			amount,
		});
		return res.data;
	},

	history: async (userId: string): Promise<CouponUsageResponse[]> => {
		const res = await api.get<CouponUsageResponse[]>(
			"/billing/coupons/history",
			{ params: { userId } },
		);
		return res.data;
	},

	adminListAll: async (): Promise<CouponUsageResponse[]> => {
		const res = await api.get<CouponUsageResponse[]>("/admin/billing/coupons");
		return res.data;
	},

	adminListByCoupon: async (
		couponId: string,
	): Promise<CouponUsageResponse[]> => {
		const res = await api.get<CouponUsageResponse[]>(
			`/admin/billing/coupons/${couponId}/usages`,
		);
		return res.data;
	},
};
