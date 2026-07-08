"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ClinicWorkingHoursItem } from "@/lib/schemas/schedule/clinic-working-hours-item.schema";
import { scheduleRepository } from "../repositories/schedule.repository";
import { scheduleKeys } from "./schedule-keys";

export function useSaveClinicWorkingHours(clinicId: string | undefined) {
	const queryClient = useQueryClient();
	const id = clinicId ?? "";
	return useMutation({
		mutationFn: (items: ClinicWorkingHoursItem[]) =>
			scheduleRepository.saveClinicWorkingHours(id, items),
		onSuccess: () => {
			if (id) {
				queryClient.invalidateQueries({
					queryKey: scheduleKeys.clinicHours(id),
				});
			}
		},
	});
}
