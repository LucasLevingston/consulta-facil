"use client";

import { useQuery } from "@tanstack/react-query";
import { queueKeys } from "@/components/appointments/hooks";
import { appointmentCheckinRepository } from "@/features/appointments";

export function useQueue() {
	return useQuery({
		queryKey: queueKeys.queue,
		queryFn: () => appointmentCheckinRepository.getQueue(),
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
