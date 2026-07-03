"use client";

import { useQuery } from "@tanstack/react-query";
import { scheduleRepository } from "../repositories/schedule.repository";
import { scheduleKeys } from "./schedule-keys";

export function useClinicWorkingHours(clinicId: string | undefined) {
	return useQuery({
		queryKey: scheduleKeys.clinicHours(clinicId ?? ""),
		queryFn: () => scheduleRepository.getClinicWorkingHours(clinicId ?? ""),
		enabled: !!clinicId,
	});
}
