"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examsRepository } from "../repositories/exams.repository";
import { examRequestKeys } from "./exam-request-keys";

export function useScheduleExam() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: examsRepository.scheduleExam,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: examRequestKeys.all });
		},
	});
}
