"use client";

import { useQuery } from "@tanstack/react-query";
import { scheduleApi } from "@/lib/api/schedule.api";
import { scheduleKeys } from "./schedule-keys";

export function useMySchedule(enabled = true) {
	return useQuery({
		queryKey: scheduleKeys.mySchedule(),
		queryFn: scheduleApi.getMySchedule,
		enabled,
		retry: false,
		staleTime: 1000 * 60 * 10,
	});
}
