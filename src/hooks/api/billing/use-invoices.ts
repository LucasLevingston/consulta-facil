"use client";

import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "@/lib/api/billing/invoice.api";

export function useAdminInvoices() {
	return useQuery({
		queryKey: ["billing", "invoices", "all"],
		queryFn: invoiceApi.listAll,
	});
}

export function useInvoice(id: string) {
	return useQuery({
		queryKey: ["billing", "invoices", id],
		queryFn: () => invoiceApi.getById(id),
		enabled: !!id,
	});
}

export function useInvoiceByPayment(paymentId: string) {
	return useQuery({
		queryKey: ["billing", "invoices", "by-payment", paymentId],
		queryFn: () => invoiceApi.getByPaymentId(paymentId),
		enabled: !!paymentId,
	});
}
