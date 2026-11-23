"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingCouponRepository } from "@/features/billing/repositories/billing-coupon.repository";

export function useUserCouponHistory(userId: string) {
	return useSuspenseQuery({
		queryKey: ["coupon-history", userId],
		queryFn: () => billingCouponRepository.getCouponHistory(userId),
	});
}
