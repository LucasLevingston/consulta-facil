"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { queueKeys } from "./appointment-keys";

export function useCallPatient() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (appointmentId: string) =>
			appointmentsRepository.callPatient(appointmentId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queueKeys.queue }),
	});
}
