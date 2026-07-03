"use client";

import { useQuery } from "@tanstack/react-query";
import { couponApi } from "@/lib/api/billing/coupon.api";

export function useAdminCouponUsages() {
	return useQuery({
		queryKey: ["admin-coupon-usages"],
		queryFn: couponApi.adminListAll,
	});
}
