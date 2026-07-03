"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examsRepository } from "../repositories/exams.repository";
import { examRequestKeys } from "./exam-request-keys";

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
