"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingCouponRepository } from "../repositories/billing-coupon.repository";

export function useAdminCoupons() {
	return useSuspenseQuery({
		queryKey: ["admin-coupons"],
		queryFn: billingCouponRepository.adminListCoupons,
	});
}
