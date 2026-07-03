"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingPaymentApi } from "@/lib/api/billing/payment.api";
import type { CreateBillingPaymentValues } from "@/lib/schemas/billing/payment.schema";

export function useCreateBillingPayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateBillingPaymentValues) => billingPaymentApi.create(data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["billing", "payments"] }),
	});
}
