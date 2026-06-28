"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examRequestKeys } from "@/hooks/api/exam-requests/exam-request-keys";
import { examLabApi } from "@/lib/api/exam-labs/exam-labs.api";

export function useCancelExamScheduling() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (schedulingId: string) =>
			examLabApi.cancelScheduling(schedulingId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: examRequestKeys.all });
		},
	});
}
