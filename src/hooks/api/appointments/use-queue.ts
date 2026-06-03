"use client";

import { useQuery } from "@tanstack/react-query";

import { appointmentsApi } from "@/lib/api/appointments.api";
import { queueKeys } from "./queue-keys";

export function useQueue() {
	return useQuery({
		queryKey: queueKeys.queue,
		queryFn: () => appointmentsApi.getQueue(),
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
