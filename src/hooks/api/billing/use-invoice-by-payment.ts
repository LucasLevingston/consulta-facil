"use client";

import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "@/lib/api/billing/invoice.api";

export function useInvoiceByPayment(paymentId: string) {
	return useQuery({
		queryKey: ["billing", "invoices", "by-payment", paymentId],
		queryFn: () => invoiceApi.getByPaymentId(paymentId),
		enabled: !!paymentId,
	});
}
