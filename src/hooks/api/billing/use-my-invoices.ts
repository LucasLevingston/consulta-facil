"use client";

import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "@/lib/api/billing/invoice.api";

export function useMyInvoices() {
	return useQuery({ queryKey: ["billing", "invoices", "mine"], queryFn: invoiceApi.listMine });
}
