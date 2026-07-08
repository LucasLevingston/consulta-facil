"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { ExamRequestStatus } from "@/lib/schemas/examRequest/exam-request-status.schema";
import { examsRepository } from "../repositories/exams.repository";
import { examRequestKeys } from "./exam-request-keys";

export function useMyExams(status?: ExamRequestStatus) {
	return useSuspenseQuery({
		queryKey: examRequestKeys.my(status),
		queryFn: () => examsRepository.getMyExams(status),
	});
}
