"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { queueKeys } from "./appointment-keys";

export function useCheckInByQr() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (token: string) => appointmentsRepository.checkInByQr(token),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queueKeys.queue }),
	});
}
