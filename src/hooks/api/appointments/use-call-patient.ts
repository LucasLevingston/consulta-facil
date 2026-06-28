"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentCheckinApi } from "@/lib/api/appointments/appointment-checkin.api";
import { queueKeys } from "./queue-keys";

export function useCallPatient() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (appointmentId: string) =>
			appointmentCheckinApi.callPatient(appointmentId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queueKeys.queue }),
	});
}
