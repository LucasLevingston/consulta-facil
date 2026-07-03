"use client";

import { useQuery } from "@tanstack/react-query";
import { billingCouponRepository } from "../repositories/billing-coupon.repository";

export function useUserCouponHistory(userId: string) {
	return useQuery({
		queryKey: ["coupon-history", userId],
		queryFn: () => billingCouponRepository.getCouponHistory(userId),
		enabled: !!userId,
	});
}
