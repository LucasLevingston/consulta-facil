"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "@/features/billing/repositories/billing-payment.repository";

export function useAdminBillingPayments() {
	return useSuspenseQuery({
		queryKey: ["billing", "payments", "all"],
		queryFn: billingPaymentRepository.listAllPayments,
	});
}
