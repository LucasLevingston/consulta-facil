"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateBillingPaymentValues } from "@/lib/schemas/billing/payment.schema";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useCreateBillingPayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateBillingPaymentValues) =>
			billingPaymentRepository.createPayment(data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "payments"] }),
	});
}
