"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentPaymentRepository } from "../repositories/appointment-payment.repository";
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
		}) => appointmentPaymentRepository.createPayment(appointmentId, amount),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
