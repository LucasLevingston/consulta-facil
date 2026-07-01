"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingCouponRepository } from "../repositories/billing-coupon.repository";

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
		}) => billingCouponRepository.applyCoupon(code, userId, paymentId, amount),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["coupon-history"] }),
	});
}
