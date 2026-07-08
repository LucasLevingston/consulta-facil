"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useAdminBillingPayments() {
	return useSuspenseQuery({
		queryKey: ["billing", "payments", "all"],
		queryFn: billingPaymentRepository.listAllPayments,
	});
}
