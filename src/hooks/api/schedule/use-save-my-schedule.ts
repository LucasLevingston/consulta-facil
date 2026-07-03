"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalScheduleApi } from "@/lib/api/professionals/professional-schedule.api";
import type { ProfessionalScheduleItem } from "@/lib/schemas/schedule/professional-schedule-item.schema";
import { scheduleKeys } from "./schedule-keys";

export function useSaveMySchedule() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (items: ProfessionalScheduleItem[]) =>
			professionalScheduleApi.saveMySchedule(items),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: scheduleKeys.mySchedule() });
		},
	});
}
