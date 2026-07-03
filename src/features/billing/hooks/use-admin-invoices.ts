"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useAdminInvoices() {
	return useQuery({
		queryKey: ["billing", "invoices", "all"],
		queryFn: billingPaymentRepository.listAllInvoices,
	});
}
