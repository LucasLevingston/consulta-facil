"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingPaymentRepository } from "../repositories/billing-payment.repository";

export function useCancelBillingPayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => billingPaymentRepository.cancelPayment(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "payments"] }),
	});
}
