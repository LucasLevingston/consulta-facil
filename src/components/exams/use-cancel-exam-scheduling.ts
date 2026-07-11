"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examRequestKeys } from "@/components/exams/hooks";
import { examsRepository } from "@/features/exams";

export function useCancelExamScheduling() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (schedulingId: string) =>
			examsRepository.cancelScheduling(schedulingId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: examRequestKeys.all });
		},
	});
}
