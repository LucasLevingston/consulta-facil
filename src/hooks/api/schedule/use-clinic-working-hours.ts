"use client";

import { useQuery } from "@tanstack/react-query";
import { scheduleApi } from "@/lib/api/schedule.api";
import { scheduleKeys } from "./schedule-keys";

export function useClinicWorkingHours(clinicId: string | undefined) {
	return useQuery({
		queryKey: scheduleKeys.clinicHours(clinicId ?? ""),
		queryFn: () => scheduleApi.getClinicWorkingHours(clinicId ?? ""),
		enabled: !!clinicId,
	});
}
