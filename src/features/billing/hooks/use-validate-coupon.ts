"use client";

import { useMutation } from "@tanstack/react-query";
import { billingCouponRepository } from "../repositories/billing-coupon.repository";

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
		}) => billingCouponRepository.validateCoupon(code, userId, amount),
	});
}
