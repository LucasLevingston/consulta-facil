"use client";

import { useQuery } from "@tanstack/react-query";

import { examRequestApi } from "@/lib/api/exam-requests/exam-requests.api";
import type { ExamRequestStatus } from "@/lib/schemas/examRequest/exam-request-status.schema";
import { examRequestKeys } from "./exam-request-keys";

export function useMyExams(status?: ExamRequestStatus) {
	return useQuery({
		queryKey: examRequestKeys.my(status),
		queryFn: () => examRequestApi.getMy(status),
	});
}
