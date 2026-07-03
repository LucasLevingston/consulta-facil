"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
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
		}) => appointmentsRepository.createPayment(appointmentId, amount),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
