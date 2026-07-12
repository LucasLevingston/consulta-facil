"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentKeys } from "@/components/appointments/hooks";
import { appointmentPaymentRepository } from "@/features/appointments";

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
