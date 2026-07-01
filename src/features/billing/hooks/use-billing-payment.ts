"use client";

import { useQuery } from "@tanstack/react-query";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useBillingPayment(id: string) {
	return useQuery({
		queryKey: ["billing", "payments", id],
		queryFn: () => billingPaymentRepository.getPayment(id),
		enabled: !!id,
	});
}
