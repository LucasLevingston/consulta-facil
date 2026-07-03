"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { couponApi } from "@/lib/api/billing/coupon.api";

export function useAdminCreateCoupon() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: couponApi.adminCreateCoupon,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
	});
}
