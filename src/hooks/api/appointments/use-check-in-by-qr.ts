"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentCheckinApi } from "@/lib/api/appointments/appointment-checkin.api";
import { queueKeys } from "./queue-keys";

export function useCheckInByQr() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (token: string) => appointmentCheckinApi.checkInByQr(token),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queueKeys.queue }),
	});
}
