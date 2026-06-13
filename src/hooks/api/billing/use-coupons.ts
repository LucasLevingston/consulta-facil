"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { couponApi } from "@/lib/api/billing/coupon.api";

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
