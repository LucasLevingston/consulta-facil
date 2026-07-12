"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queueKeys } from "@/components/appointments/hooks";
import { appointmentCheckinRepository } from "@/features/appointments";

export function useCallPatient() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (appointmentId: string) =>
			appointmentCheckinRepository.callPatient(appointmentId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queueKeys.queue }),
	});
}
