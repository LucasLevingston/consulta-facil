"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useMyInvoices() {
	return useSuspenseQuery({
		queryKey: ["billing", "invoices", "mine"],
		queryFn: billingPaymentRepository.listMyInvoices,
	});
}
