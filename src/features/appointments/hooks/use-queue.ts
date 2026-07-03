"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { queueKeys } from "./appointment-keys";

export function useQueue() {
	return useQuery({
		queryKey: queueKeys.queue,
		queryFn: appointmentsRepository.getQueue,
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
