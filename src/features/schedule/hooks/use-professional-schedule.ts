"use client";

import { useQuery } from "@tanstack/react-query";
import { scheduleRepository } from "../repositories/schedule.repository";
import { scheduleKeys } from "./schedule-keys";

export function useProfessionalSchedule(professionalId: string) {
	return useQuery({
		queryKey: scheduleKeys.byProfessional(professionalId),
		queryFn: () => scheduleRepository.getByProfessional(professionalId),
		enabled: !!professionalId,
		staleTime: 1000 * 60 * 10,
	});
}
