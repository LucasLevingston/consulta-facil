"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentCheckinRepository } from "../repositories/appointment-checkin.repository";
import { queueKeys } from "./queue-keys";

export function useCallPatient() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (appointmentId: string) =>
			appointmentCheckinRepository.callPatient(appointmentId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queueKeys.queue }),
	});
}
