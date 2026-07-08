"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examsRepository } from "../repositories/exams.repository";
import { examRequestKeys } from "./exam-request-keys";

export function useUploadExamResult() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ examId, file }: { examId: string; file: File }) =>
			examsRepository.uploadExamResult(examId, file),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: examRequestKeys.all }),
	});
}
