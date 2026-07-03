"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPaymentApi } from "@/lib/api/billing/payment.api";

export function useAdminBillingPayments() {
	return useQuery({
		queryKey: ["billing", "payments", "all"],
		queryFn: billingPaymentApi.listAll,
	});
}
