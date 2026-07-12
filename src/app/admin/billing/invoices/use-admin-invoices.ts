"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "@/features/billing/repositories/billing-payment.repository";

export function useAdminInvoices() {
	return useSuspenseQuery({
		queryKey: ["billing", "invoices", "all"],
		queryFn: billingPaymentRepository.listAllInvoices,
	});
}
