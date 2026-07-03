"use client";

import { useQuery } from "@tanstack/react-query";
import { billingCouponRepository } from "../repositories/billing-coupon.repository";

export function useAdminCoupons() {
	return useQuery({
		queryKey: ["admin-coupons"],
		queryFn: billingCouponRepository.adminListCoupons,
	});
}
