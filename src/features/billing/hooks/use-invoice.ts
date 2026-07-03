"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useInvoice(id: string) {
	return useQuery({
		queryKey: ["billing", "invoices", id],
		queryFn: () => billingPaymentRepository.getInvoice(id),
		enabled: !!id,
	});
}
