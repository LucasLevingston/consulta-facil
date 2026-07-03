"use client";

import { useMutation } from "@tanstack/react-query";
import { couponApi } from "@/lib/api/billing/coupon.api";

export function useValidateCoupon() {
	return useMutation({
		mutationFn: ({ code, userId, amount }: { code: string; userId: string; amount: number }) =>
			couponApi.validate(code, userId, amount),
	});
}
