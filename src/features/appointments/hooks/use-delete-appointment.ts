"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { appointmentKeys } from "./appointment-keys";

export function useDeleteAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentsRepository.delete(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
