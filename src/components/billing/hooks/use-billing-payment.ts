"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "@/features/billing/repositories/billing-payment.repository";

export function useBillingPayment(id: string) {
	return useQuery({
		queryKey: ["billing", "payments", id],
		queryFn: () => billingPaymentRepository.getPayment(id),
		enabled: !!id,
	});
}
