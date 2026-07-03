"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useMyInvoices() {
	return useQuery({
		queryKey: ["billing", "invoices", "mine"],
		queryFn: billingPaymentRepository.listMyInvoices,
	});
}
