"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfessionalScheduleItem } from "@/lib/schemas/schedule/professional-schedule-item.schema";
import { scheduleRepository } from "../repositories/schedule.repository";
import { scheduleKeys } from "./schedule-keys";

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
