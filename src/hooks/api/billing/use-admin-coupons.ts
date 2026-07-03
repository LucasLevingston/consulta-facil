"use client";

import { useQuery } from "@tanstack/react-query";
import { couponApi } from "@/lib/api/billing/coupon.api";

export function useAdminCoupons() {
	return useQuery({
		queryKey: ["admin-coupons"],
		queryFn: couponApi.adminListCoupons,
	});
}
