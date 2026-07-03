"use client";

import { useQuery } from "@tanstack/react-query";
import { clinicWorkingHoursApi } from "@/lib/api/clinics/clinic-working-hours.api";
import { scheduleKeys } from "./schedule-keys";

export function useClinicWorkingHours(clinicId: string | undefined) {
	return useQuery({
		queryKey: scheduleKeys.clinicHours(clinicId ?? ""),
		queryFn: () => clinicWorkingHoursApi.getClinicWorkingHours(clinicId ?? ""),
		enabled: !!clinicId,
	});
}
