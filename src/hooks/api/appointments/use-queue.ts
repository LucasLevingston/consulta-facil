"use client";

import { useQuery } from "@tanstack/react-query";

import { appointmentCheckinApi } from "@/lib/api/appointments/appointment-checkin.api";
import { queueKeys } from "./queue-keys";

export function useQueue() {
	return useQuery({
		queryKey: queueKeys.queue,
		queryFn: () => appointmentCheckinApi.getQueue(),
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
