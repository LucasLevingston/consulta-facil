"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examRequestKeys } from "@/components/exams/hooks";
import { examsRepository } from "@/features/exams";

export function useScheduleExam() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: examsRepository.scheduleExam,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: examRequestKeys.all });
		},
	});
}
