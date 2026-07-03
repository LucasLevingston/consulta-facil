"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPaymentApi } from "@/lib/api/billing/payment.api";

export function useBillingPayment(id: string) {
	return useQuery({
		queryKey: ["billing", "payments", id],
		queryFn: () => billingPaymentApi.getById(id),
		enabled: !!id,
	});
}
