"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentPaymentApi } from "@/lib/api/appointments/appointment-payment.api";
import { appointmentKeys } from "./appointment-keys";

export function useCreatePayment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			appointmentId,
			amount,
		}: {
			appointmentId: string;
			amount?: number;
		}) => appointmentPaymentApi.createPayment(appointmentId, amount),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
