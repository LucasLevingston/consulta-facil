"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { scheduleKeys } from "@/components/schedule/hooks";
import { scheduleRepository } from "@/features/schedule";

export function useClinicWorkingHours(clinicId: string) {
	return useSuspenseQuery({
		queryKey: scheduleKeys.clinicHours(clinicId),
		queryFn: () => scheduleRepository.getClinicWorkingHours(clinicId),
	});
}
