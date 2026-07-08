"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentCheckinRepository } from "../repositories/appointment-checkin.repository";
import { queueKeys } from "./queue-keys";

export function useQueue() {
	return useQuery({
		queryKey: queueKeys.queue,
		queryFn: () => appointmentCheckinRepository.getQueue(),
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
