import { api } from "@/config/api";
import type {
	CouponResponse,
	CouponUsageResponse,
	CouponValidationResult,
	CreateCouponData,
	UpdateCouponData,
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

	adminListCoupons: async (): Promise<CouponResponse[]> => {
		const res = await api.get<CouponResponse[]>("/admin/billing/coupons/codes");
		return res.data;
	},

	adminCreateCoupon: async (
		data: CreateCouponData,
	): Promise<CouponResponse> => {
		const payload = {
			...data,
			maxUsesPerUser: data.maxUsesPerUser ?? 1,
			expiresAt: data.expiresAt ? `${data.expiresAt}T23:59:59` : undefined,
		};
		const res = await api.post<CouponResponse>(
			"/admin/billing/coupons/codes",
			payload,
		);
		return res.data;
	},

	adminUpdateCoupon: async (
		id: string,
		data: UpdateCouponData,
	): Promise<CouponResponse> => {
		const payload = {
			...data,
			expiresAt: data.expiresAt ? `${data.expiresAt}T23:59:59` : undefined,
		};
		const res = await api.patch<CouponResponse>(
			`/admin/billing/coupons/codes/${id}`,
			payload,
		);
		return res.data;
	},
};
