"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "@/features/billing/repositories/billing-payment.repository";

export function useMyBillingPayments(payerId: string) {
	return useSuspenseQuery({
		queryKey: ["billing", "payments", "me", payerId],
		queryFn: () => billingPaymentRepository.listMyPayments(payerId),
	});
}
