"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalScheduleApi } from "@/lib/api/professionals/professional-schedule.api";
import { scheduleKeys } from "./schedule-keys";

export function useMySchedule(enabled = true) {
	return useQuery({
		queryKey: scheduleKeys.mySchedule(),
		queryFn: professionalScheduleApi.getMySchedule,
		enabled,
		retry: false,
		staleTime: 1000 * 60 * 10,
	});
}
