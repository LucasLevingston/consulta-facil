"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { couponApi } from "@/lib/api/billing/coupon.api";

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
