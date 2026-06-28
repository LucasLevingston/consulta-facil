"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicWorkingHoursApi } from "@/lib/api/clinics/clinic-working-hours.api";
import type { ClinicWorkingHoursItem } from "@/lib/schemas/schedule/clinic-working-hours-item.schema";
import { scheduleKeys } from "./schedule-keys";

export function useSaveClinicWorkingHours(clinicId: string | undefined) {
	const queryClient = useQueryClient();
	const id = clinicId ?? "";
	return useMutation({
		mutationFn: (items: ClinicWorkingHoursItem[]) =>
			clinicWorkingHoursApi.saveClinicWorkingHours(id, items),
		onSuccess: () => {
			if (id) {
				queryClient.invalidateQueries({
					queryKey: scheduleKeys.clinicHours(id),
				});
			}
		},
	});
}
