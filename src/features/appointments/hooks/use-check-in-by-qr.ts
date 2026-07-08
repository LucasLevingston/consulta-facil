"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentCheckinRepository } from "../repositories/appointment-checkin.repository";
import { queueKeys } from "./queue-keys";

export function useCheckInByQr() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (token: string) =>
			appointmentCheckinRepository.checkInByQr(token),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queueKeys.queue }),
	});
}
