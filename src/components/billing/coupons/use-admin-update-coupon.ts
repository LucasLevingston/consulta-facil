"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingCouponRepository } from "@/features/billing/repositories/billing-coupon.repository";
import type { UpdateCouponData } from "@/lib/schemas/billing/coupon.schema";

export function useAdminUpdateCoupon() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateCouponData }) =>
			billingCouponRepository.adminUpdateCoupon(id, data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
	});
}
