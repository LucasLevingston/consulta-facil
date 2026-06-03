"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsApi } from "@/lib/api/appointments.api";
import { queueKeys } from "./queue-keys";

export function useCheckInByQr() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (token: string) => appointmentsApi.checkInByQr(token),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queueKeys.queue }),
	});
}
