"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReviewExamRequestInput } from "@/lib/schemas/examRequest/review-exam-request.schema";
import { examsRepository } from "../repositories/exams.repository";
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
		}) => examsRepository.reviewExam(examId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: examRequestKeys.all }),
	});
}
