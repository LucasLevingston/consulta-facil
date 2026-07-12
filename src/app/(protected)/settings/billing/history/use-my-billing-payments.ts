"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "@/features/billing/repositories/billing-payment.repository";

export function useMyBillingPayments(payerId: string) {
	return useQuery({
		queryKey: ["billing", "payments", "me", payerId],
		queryFn: () => billingPaymentRepository.listMyPayments(payerId),
		enabled: !!payerId,
	});
}
