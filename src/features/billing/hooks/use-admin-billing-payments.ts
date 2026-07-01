"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useAdminBillingPayments() {
	return useQuery({
		queryKey: ["billing", "payments", "all"],
		queryFn: billingPaymentRepository.listAllPayments,
	});
}
