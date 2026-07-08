"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingCouponRepository } from "../repositories/billing-coupon.repository";

export function useAdminCouponUsages() {
	return useSuspenseQuery({
		queryKey: ["admin-coupon-usages"],
		queryFn: billingCouponRepository.adminListCouponUsages,
	});
}
