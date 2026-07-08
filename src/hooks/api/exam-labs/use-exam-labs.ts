"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { examLabApi } from "@/lib/api/exam-labs/exam-labs.api";
import { examLabKeys } from "./exam-lab-keys";

export function useExamLabs() {
	return useSuspenseQuery({
		queryKey: examLabKeys.list(),
		queryFn: () => examLabApi.getAll(),
	});
}
