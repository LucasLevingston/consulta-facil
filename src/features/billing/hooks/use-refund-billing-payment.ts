"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useRefundBillingPayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => billingPaymentRepository.refundPayment(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "payments"] }),
	});
}
