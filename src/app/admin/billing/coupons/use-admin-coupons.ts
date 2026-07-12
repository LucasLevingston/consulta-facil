"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingCouponRepository } from "@/features/billing/repositories/billing-coupon.repository";

export function useAdminCoupons() {
	return useSuspenseQuery({
		queryKey: ["admin-coupons"],
		queryFn: billingCouponRepository.adminListCoupons,
	});
}
