"use client";

import { useQuery } from "@tanstack/react-query";
import { couponApi } from "@/lib/api/billing/coupon.api";

export function useUserCouponHistory(userId: string) {
	return useQuery({
		queryKey: ["coupon-history", userId],
		queryFn: () => couponApi.history(userId),
		enabled: !!userId,
	});
}
