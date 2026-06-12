"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingPaymentApi } from "@/lib/api/billing/payment.api";
import type { CreateBillingPaymentValues } from "@/lib/schemas/billing/payment.schema";

export function useAdminBillingPayments() {
	return useQuery({
		queryKey: ["billing", "payments", "all"],
		queryFn: billingPaymentApi.listAll,
	});
}

export function useMyBillingPayments(payerId: string) {
	return useQuery({
		queryKey: ["billing", "payments", "me", payerId],
		queryFn: () => billingPaymentApi.myPayments(payerId),
		enabled: !!payerId,
	});
}

export function useBillingPayment(id: string) {
	return useQuery({
		queryKey: ["billing", "payments", id],
		queryFn: () => billingPaymentApi.getById(id),
		enabled: !!id,
	});
}

export function useCreateBillingPayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateBillingPaymentValues) =>
			billingPaymentApi.create(data),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "payments"] }),
	});
}

export function useCancelBillingPayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => billingPaymentApi.cancel(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "payments"] }),
	});
}

export function useRefundBillingPayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => billingPaymentApi.refund(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["billing", "payments"] }),
	});
}
