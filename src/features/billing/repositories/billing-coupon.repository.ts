import { couponApi } from "@/lib/api/billing/coupon.api";
import type {
	CouponResponse,
	CouponUsageResponse,
	CouponValidationResult,
	UpdateCouponData,
} from "@/lib/schemas/billing/coupon.schema";

export const billingCouponRepository = {
	validateCoupon: async (
		code: string,
		userId: string,
		amount: number,
	): Promise<CouponValidationResult> =>
		couponApi.validate(code, userId, amount),
	applyCoupon: async (
		code: string,
		userId: string,
		paymentId: string | null,
		amount: number,
	): Promise<CouponUsageResponse> =>
		couponApi.apply(code, userId, paymentId, amount),
	getCouponHistory: async (userId: string): Promise<CouponUsageResponse[]> =>
		couponApi.history(userId),
	adminListCouponUsages: async (): Promise<CouponUsageResponse[]> =>
		couponApi.adminListAll(),
	adminListCoupons: async (): Promise<CouponResponse[]> =>
		couponApi.adminListCoupons(),
	adminCreateCoupon: async (
		data: Parameters<typeof couponApi.adminCreateCoupon>[0],
	): Promise<CouponResponse> => couponApi.adminCreateCoupon(data),
	adminUpdateCoupon: async (
		id: string,
		data: UpdateCouponData,
	): Promise<CouponResponse> => couponApi.adminUpdateCoupon(id, data),
};
