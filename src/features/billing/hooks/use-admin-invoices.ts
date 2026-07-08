"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useAdminInvoices() {
	return useSuspenseQuery({
		queryKey: ["billing", "invoices", "all"],
		queryFn: billingPaymentRepository.listAllInvoices,
	});
}
