"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { scheduleRepository } from "../repositories/schedule.repository";
import { scheduleKeys } from "./schedule-keys";

export function useClinicWorkingHours(clinicId: string) {
	return useSuspenseQuery({
		queryKey: scheduleKeys.clinicHours(clinicId),
		queryFn: () => scheduleRepository.getClinicWorkingHours(clinicId),
	});
}
