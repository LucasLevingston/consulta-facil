"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingPaymentApi } from "@/lib/api/billing/payment.api";

export function useRefundBillingPayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => billingPaymentApi.refund(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["billing", "payments"] }),
	});
}
