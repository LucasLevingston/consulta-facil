"use client";

import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "@/lib/api/billing/invoice.api";

export function useInvoice(id: string) {
	return useQuery({
		queryKey: ["billing", "invoices", id],
		queryFn: () => invoiceApi.getById(id),
		enabled: !!id,
	});
}
