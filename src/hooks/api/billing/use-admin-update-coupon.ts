"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { couponApi } from "@/lib/api/billing/coupon.api";
import type { UpdateCouponData } from "@/lib/schemas/billing/coupon.schema";

export function useAdminUpdateCoupon() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateCouponData }) =>
			couponApi.adminUpdateCoupon(id, data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
	});
}
