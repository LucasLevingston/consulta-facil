"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingPaymentRepository } from "@/features/billing/repositories/billing-payment.repository";
import type { CreateBillingPaymentValues } from "@/lib/schemas/billing/payment.schema";

export function useCreateBillingPayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateBillingPaymentValues) =>
			billingPaymentRepository.createPayment(data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "payments"] }),
	});
}
