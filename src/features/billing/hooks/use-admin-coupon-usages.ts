"use client";

import { useQuery } from "@tanstack/react-query";
import { billingCouponRepository } from "../repositories/billing-coupon.repository";

export function useAdminCouponUsages() {
	return useQuery({
		queryKey: ["admin-coupon-usages"],
		queryFn: billingCouponRepository.adminListCouponUsages,
	});
}
