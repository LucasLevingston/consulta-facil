"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleKeys } from "@/components/schedule/hooks";
import { scheduleRepository } from "@/features/schedule";
import type { ProfessionalScheduleItem } from "@/lib/schemas/schedule/professional-schedule-item.schema";

export function useSaveMySchedule() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (items: ProfessionalScheduleItem[]) =>
			scheduleRepository.saveMySchedule(items),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: scheduleKeys.mySchedule() });
		},
	});
}
