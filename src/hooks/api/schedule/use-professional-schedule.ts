"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalScheduleApi } from "@/lib/api/professionals/professional-schedule.api";
import { scheduleKeys } from "./schedule-keys";

export function useProfessionalSchedule(professionalId: string) {
	return useQuery({
		queryKey: scheduleKeys.byProfessional(professionalId),
		queryFn: () =>
			professionalScheduleApi.getScheduleByProfessional(professionalId),
		enabled: !!professionalId,
		staleTime: 1000 * 60 * 10,
	});
}
