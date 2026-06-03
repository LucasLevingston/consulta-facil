"use client";

import { useQuery } from "@tanstack/react-query";
import { scheduleApi } from "@/lib/api/schedule.api";
import { scheduleKeys } from "./schedule-keys";

export function useProfessionalSchedule(professionalId: string) {
	return useQuery({
		queryKey: scheduleKeys.byProfessional(professionalId),
		queryFn: () => scheduleApi.getScheduleByProfessional(professionalId),
		enabled: !!professionalId,
		staleTime: 1000 * 60 * 10,
	});
}
