"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "@/features/billing/repositories/billing-payment.repository";

export function useMyInvoices() {
	return useSuspenseQuery({
		queryKey: ["billing", "invoices", "mine"],
		queryFn: billingPaymentRepository.listMyInvoices,
	});
}
