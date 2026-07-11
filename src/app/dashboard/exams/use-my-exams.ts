"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { examRequestKeys } from "@/components/exams/hooks";
import { examsRepository } from "@/features/exams";
import type { ExamRequestStatus } from "@/lib/schemas/examRequest/exam-request-status.schema";

export function useMyExams(status?: ExamRequestStatus) {
	return useSuspenseQuery({
		queryKey: examRequestKeys.my(status),
		queryFn: () => examsRepository.getMyExams(status),
	});
}
