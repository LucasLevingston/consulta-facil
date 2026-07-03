"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPaymentApi } from "@/lib/api/billing/payment.api";

export function useMyBillingPayments(payerId: string) {
	return useQuery({
		queryKey: ["billing", "payments", "me", payerId],
		queryFn: () => billingPaymentApi.myPayments(payerId),
		enabled: !!payerId,
	});
}
