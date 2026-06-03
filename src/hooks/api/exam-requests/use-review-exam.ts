"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { examRequestApi } from "@/lib/api/examRequest.api";
import type { ReviewExamRequestInput } from "@/lib/schemas/examRequest.schema";
import { examRequestKeys } from "./exam-request-keys";

export function useReviewExam() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			examId,
			data,
		}: {
			examId: string;
			data: ReviewExamRequestInput;
		}) => examRequestApi.review(examId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: examRequestKeys.all }),
	});
}
