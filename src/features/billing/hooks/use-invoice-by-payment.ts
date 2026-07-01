"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useInvoiceByPayment(paymentId: string) {
	return useQuery({
		queryKey: ["billing", "invoices", "by-payment", paymentId],
		queryFn: () => billingPaymentRepository.getInvoiceByPayment(paymentId),
		enabled: !!paymentId,
	});
}
