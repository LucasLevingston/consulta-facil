"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { examRequestApi } from "@/lib/api/exam-requests/exam-requests.api";
import { examRequestKeys } from "./exam-request-keys";

export function useUploadExamResult() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ examId, file }: { examId: string; file: File }) =>
			examRequestApi.upload(examId, file),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: examRequestKeys.all }),
	});
}
