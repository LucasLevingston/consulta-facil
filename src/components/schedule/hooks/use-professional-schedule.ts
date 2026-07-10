"use client";

import { useQuery } from "@tanstack/react-query";
import { scheduleRepository } from "@/features/schedule";
import { scheduleKeys } from "./schedule-keys";

export function useProfessionalSchedule(professionalId: string) {
	return useQuery({
		queryKey: scheduleKeys.byProfessional(professionalId),
		queryFn: () => scheduleRepository.getScheduleByProfessional(professionalId),
		enabled: !!professionalId,
		staleTime: 1000 * 60 * 10,
	});
}
