"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examRequestKeys } from "@/hooks/api/exam-requests/exam-request-keys";
import { examLabApi } from "@/lib/api/examLab.api";

export function useScheduleExam() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: examLabApi.scheduleExam,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: examRequestKeys.all });
		},
	});
}
