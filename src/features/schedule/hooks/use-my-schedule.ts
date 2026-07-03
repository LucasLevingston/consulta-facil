"use client";

import { useQuery } from "@tanstack/react-query";
import { scheduleRepository } from "../repositories/schedule.repository";
import { scheduleKeys } from "./schedule-keys";

export function useMySchedule(enabled = true) {
	return useQuery({
		queryKey: scheduleKeys.mySchedule(),
		queryFn: scheduleRepository.getMySchedule,
		enabled,
		retry: false,
		staleTime: 1000 * 60 * 10,
	});
}
