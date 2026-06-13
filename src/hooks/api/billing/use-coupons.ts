"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { couponApi } from "@/lib/api/billing/coupon.api";
import type { UpdateCouponData } from "@/lib/schemas/billing/coupon.schema";

export function useValidateCoupon() {
	return useMutation({
		mutationFn: ({
			code,
			userId,
			amount,
		}: {
			code: string;
			userId: string;
			amount: number;
		}) => couponApi.validate(code, userId, amount),
	});
}

export function useApplyCoupon() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			code,
			userId,
			paymentId,
			amount,
		}: {
			code: string;
			userId: string;
			paymentId: string | null;
			amount: number;
		}) => couponApi.apply(code, userId, paymentId, amount),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["coupon-history"] }),
	});
}

export function useUserCouponHistory(userId: string) {
	return useQuery({
		queryKey: ["coupon-history", userId],
		queryFn: () => couponApi.history(userId),
		enabled: !!userId,
	});
}

export function useAdminCouponUsages() {
	return useQuery({
		queryKey: ["admin-coupon-usages"],
		queryFn: couponApi.adminListAll,
	});
}

export function useAdminCoupons() {
	return useQuery({
		queryKey: ["admin-coupons"],
		queryFn: couponApi.adminListCoupons,
	});
}

export function useAdminCreateCoupon() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: couponApi.adminCreateCoupon,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
	});
}

export function useAdminUpdateCoupon() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateCouponData }) =>
			couponApi.adminUpdateCoupon(id, data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
	});
}
