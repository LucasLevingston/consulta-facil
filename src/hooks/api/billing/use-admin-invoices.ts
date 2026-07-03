"use client";

import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "@/lib/api/billing/invoice.api";

export function useAdminInvoices() {
	return useQuery({ queryKey: ["billing", "invoices", "all"], queryFn: invoiceApi.listAll });
}
