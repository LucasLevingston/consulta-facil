"use client";

import { useQuery } from "@tanstack/react-query";
import { scheduleKeys } from "@/components/schedule/hooks";
import { scheduleRepository } from "@/features/schedule";

export function useMySchedule(enabled = true) {
	return useQuery({
		queryKey: scheduleKeys.mySchedule(),
		queryFn: scheduleRepository.getMySchedule,
		enabled,
		retry: false,
		staleTime: 1000 * 60 * 10,
	});
}
