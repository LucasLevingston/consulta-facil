"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleApi } from "@/lib/api/schedule.api";
import type { ClinicWorkingHoursItem } from "@/lib/schemas/schedule/clinic-working-hours-item.schema";
import { scheduleKeys } from "./schedule-keys";

export function useSaveClinicWorkingHours(clinicId: string | undefined) {
	const queryClient = useQueryClient();
	const id = clinicId ?? "";
	return useMutation({
		mutationFn: (items: ClinicWorkingHoursItem[]) =>
			scheduleApi.saveClinicWorkingHours(id, items),
		onSuccess: () => {
			if (id) {
				queryClient.invalidateQueries({
					queryKey: scheduleKeys.clinicHours(id),
				});
			}
		},
	});
}
