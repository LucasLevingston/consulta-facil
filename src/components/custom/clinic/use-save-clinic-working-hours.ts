"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleKeys } from "@/components/schedule/hooks";
import { scheduleRepository } from "@/features/schedule";
import type { ClinicWorkingHoursItem } from "@/lib/schemas/schedule/clinic-working-hours-item.schema";

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
