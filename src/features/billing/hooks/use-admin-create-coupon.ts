"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingCouponRepository } from "../repositories/billing-coupon.repository";

export function useAdminCreateCoupon() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: billingCouponRepository.adminCreateCoupon,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
	});
}
